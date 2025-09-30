#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration Variables ---
# PROJECT_ID and REGION should be set as environment variables or via `gcloud config`
# Example: export PROJECT_ID="your-gcp-project-id"
# Example: gcloud config set project your-gcp-project-id
# Example: gcloud config set region us-central1

# Ensure PROJECT_ID and REGION are set
if [ -z "$PROJECT_ID" ]; then
  echo "Error: PROJECT_ID environment variable is not set. Please set it before running the script."
  exit 1
fi

if [ -z "$REGION" ]; then
  echo "Error: REGION environment variable is not set. Please set it before running the script."
  exit 1
fi

# --- GCP Setup ---
echo "Setting GCP project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

echo "Configuring Docker for GCR..."
gcloud auth configure-docker

# --- Fetch secrets from Secret Manager ---
echo "Fetching database credentials from Secret Manager..."
POSTGRES_USER=$(gcloud secrets versions access latest --secret="POSTGRES_USER" --project=$PROJECT_ID)
POSTGRES_PASSWORD=$(gcloud secrets versions access latest --secret="POSTGRES_PASSWORD" --project=$PROJECT_ID)
POSTGRES_DB=$(gcloud secrets versions access latest --secret="POSTGRES_DB" --project=$PROJECT_ID)

# --- Build and Push Docker Images to GCR ---

echo "Building and pushing PostgreSQL image..."
# Using official postgres image, tagging and pushing to GCR
docker pull postgres:13-alpine
docker tag postgres:13-alpine gcr.io/$PROJECT_ID/postgres:13-alpine
docker push gcr.io/$PROJECT_ID/postgres:13-alpine

echo "Building and pushing backend image..."
docker build -t gcr.io/$PROJECT_ID/backend:latest ./backend/src
docker push gcr.io/$PROJECT_ID/backend:latest

echo "Building and pushing frontend image..."
docker build -t gcr.io/$PROJECT_ID/frontend:latest ./frontend
docker push gcr.io/$PROJECT_ID/frontend:latest

# --- Deploy Services to Cloud Run ---

echo "Deploying PostgreSQL service to Cloud Run..."
# Deploy PostgreSQL as a private Cloud Run service
gcloud run deploy postgres-db \
  --image gcr.io/$PROJECT_ID/postgres:13-alpine \
  --platform managed \
  --region $REGION \
  --set-env-vars POSTGRES_USER=$POSTGRES_USER,POSTGRES_PASSWORD=$POSTGRES_PASSWORD,POSTGRES_DB=$POSTGRES_DB \
  --no-allow-unauthenticated \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 1 \
  --port 5432 \
  --timeout 300s \
  --project $PROJECT_ID

# Get the internal URL of the PostgreSQL service
POSTGRES_SERVICE_URL=$(gcloud run services describe postgres-db --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')
# Extract hostname from URL (e.g., http://postgres-db-xxxxxx-uc.a.run.app -> postgres-db-xxxxxx-uc.a.run.app)
POSTGRES_HOST=$(echo $POSTGRES_SERVICE_URL | sed -e 's/^https:\/\///' -e 's/^http:\/\///')

echo "Deploying backend service to Cloud Run..."
# Deploy backend, connecting to the PostgreSQL service
gcloud run deploy backend \
  --image gcr.io/$PROJECT_ID/backend:latest \
  --platform managed \
  --region $REGION \
  --set-env-vars DATABASE_URL="postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}" \
  --set-secrets GOOGLE_API_KEY=GOOGLE_API_KEY:latest,TWITTER_API_KEY=TWITTER_API_KEY:latest,TWITTER_API_SECRET=TWITTER_API_SECRET:latest,TWITTER_ACCESS_TOKEN=TWITTER_ACCESS_TOKEN:latest,TWITTER_ACCESS_TOKEN_SECRET=TWITTER_ACCESS_TOKEN_SECRET:latest \
  --no-allow-unauthenticated \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 1 \
  --port 8000 \
  --timeout 300s \
  --project $PROJECT_ID

# Get the URL of the backend service
BACKEND_URL=$(gcloud run services describe backend --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')

echo "Deploying frontend service to Cloud Run..."
# Deploy frontend, pointing to the backend service
gcloud run deploy frontend \
  --image gcr.io/$PROJECT_ID/frontend:latest \
  --platform managed \
  --region $REGION \
  --set-env-vars VITE_API_BASE_URL=$BACKEND_URL \
  --allow-unauthenticated \
  --cpu 1 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 1 \
  --port 80 \
  --timeout 300s \
  --project $PROJECT_ID

FRONTEND_URL=$(gcloud run services describe frontend --platform managed --region $REGION --project $PROJECT_ID --format 'value(status.url)')

# --- Database Initialization Job ---
echo "Running database initialization job..."
# Deploy a Cloud Run Job using the backend image to run reset_database.py
gcloud run jobs deploy db-init-job \
  --image gcr.io/$PROJECT_ID/backend:latest \
  --platform managed \
  --region $REGION \
  --command python \
  --arg reset_database.py \
  --set-env-vars DATABASE_URL="postgresql+asyncpg://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:5432/${POSTGRES_DB}" \
  --cpu 1 \
  --memory 512Mi \
  --max-retries 0 \
  --project $PROJECT_ID

# Execute the job
gcloud run jobs execute db-init-job \
  --region $REGION \
  --project $PROJECT_ID

echo "Deployment complete!"
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"
echo "PostgreSQL Host (internal): $POSTGRES_HOST"

echo ""
echo "--- IMPORTANT ---"
echo "1. Set the PROJECT_ID and REGION environment variables before running this script, or configure them using 'gcloud config set project' and 'gcloud config set region'."
echo "2. Create the following secrets in GCP Secret Manager before running this script:"
echo "   - POSTGRES_USER"
echo "   - POSTGRES_PASSWORD"
echo "   - POSTGRES_DB"
echo "   - GOOGLE_API_KEY"
echo "   - TWITTER_API_KEY"
echo "   - TWITTER_API_SECRET"
echo "   - TWITTER_ACCESS_TOKEN"
echo "   - TWITTER_ACCESS_TOKEN_SECRET"
echo "   You can do this via the GCP Console or using 'gcloud secrets create [SECRET_NAME] --data-file=/path/to/your/secret_value.txt'"
echo "3. Ensure the Cloud Run API, Secret Manager API, Artifact Registry API, and Cloud Run Job API are enabled in your GCP project."