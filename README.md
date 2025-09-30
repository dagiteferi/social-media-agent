# E-Commerce Social Media Agent (ESMA)

![Project Status](https://img.shields.io/badge/Status-In%20Progress-yellow)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
  - [Backend API Endpoints](#backend-api-endpoints)
  - [Frontend Application](#frontend-application)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

The **E-Commerce Social Media Agent (ESMA)** is a full-stack, AI-driven automation solution designed to empower e-commerce brands by streamlining their social media management, specifically for Twitter. This project aims to significantly reduce manual effort in content creation and scheduling, allowing businesses to focus on strategic growth while maintaining a consistent and engaging online presence.

Developed as part of a full-stack AI web developer assignment, ESMA showcases a robust, modular, and scalable architecture that leverages cutting-edge AI and cloud technologies, all while adhering to free-tier resource constraints.

## Features

-   **AI-Powered Content Generation:** Generate engaging Twitter posts using Google's Gemini API based on user prompts.
-   **Content Validation:** Automatically validates generated content against Twitter's character limits.
-   **Post Management:** Create, approve, and retrieve social media posts through a dedicated backend API.
-   **Automated Scheduling:** Schedule approved posts to Twitter via the Twitter API, with retry mechanisms for robustness.
-   **Persistent Storage:** PostgreSQL database for storing post data and application state.
-   **Mock Analytics:** Provides mock engagement metrics (likes, retweets) for posts.
-   **Modular & Scalable Backend:** Built with FastAPI, organized into services, endpoints, and a `langgraph`-based AI workflow.
-   **Intuitive Frontend:** A responsive React web UI for seamless interaction, post preview, approval, and analytics visualization.

## Technology Stack

**Backend:**
-   **Framework:** FastAPI
-   **Language:** Python 3.x
-   **Database:** PostgreSQL
-   **AI/LLM:** Google Gemini API
-   **Social Media API:** Twitter API v2
-   **Workflow Orchestration:** `langgraph`
-   **Configuration:** `pydantic-settings`
-   **HTTP Client:** `requests`
-   **ASGI Server:** `uvicorn`

**Frontend:**
-   **Framework:** React (JavaScript/TypeScript)
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS / Bootstrap
-   **State Management:** React Context API / Zustand / Jotai
-   **Routing:** React Router DOM
-   **API Interaction:** Axios / Fetch API
-   **Charting:** Recharts / Chart.js
-   **Icons:** React Icons / Font Awesome

**Deployment:**
-   **Cloud Platform:** Google Cloud Platform (GCP) Always Free Tier
-   **Containerization:** Docker
-   **Hosting:** GCP Cloud Run (for Backend, Frontend, and PostgreSQL database)
-   **Secret Management:** GCP Secret Manager

## Architecture

The project follows a clear separation of concerns with a decoupled frontend and backend.

**Backend:**
The backend is a Python FastAPI application structured for modularity, utilizing a PostgreSQL database for persistent storage:
-   **`main.py`**: The application entry point, responsible for setting up middleware and including API routers.
-   **`api/endpoints/`**: Contains modular route definitions for `content`, `scheduling`, and `analytics`.
-   **`api/services/`**: Houses business logic and external API integrations (`gemini_service`, `twitter_service`, `postgresql_storage_service`).
-   **`api/models/`**: Defines Pydantic models for data structures (`Post`).
-   **`api/api_config.py`**: Centralizes API-specific configurations (URLs, retry logic).
-   **`graphs/`**: Implements the AI workflow using `langgraph`, separating state, nodes, and workflow logic for clarity.
-   **`core/`**: Provides core utilities like configuration management (`config.py`) and logging (`logging.py`).

**Frontend:**
A React-based SPA consumes the backend APIs, providing a user-friendly interface for all interactions.

## Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed:
-   [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
-   [Docker](https://docs.docker.com/get-docker/)
-   [Docker Compose](https://docs.docker.com/compose/install/)
-   [Google Cloud CLI (gcloud CLI)](https://cloud.google.com/sdk/docs/install) for GCP deployment

### Local Development

To run the application locally using Docker Compose:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/social-media-agent.git
    cd social-media-agent
    ```
2.  **Configure Environment Variables:**
    Create a `.env` file in the project root directory (where `docker-compose.yml` is located) based on the provided `.env.example` (or the one you created earlier). **Ensure this file is added to your `.gitignore` to prevent accidental commits.**
    ```ini
    # .env file for local development - DO NOT COMMIT TO GIT!

    # Google API Key
    GOOGLE_API_KEY="your_google_gemini_api_key"

    # Twitter API Keys
    TWITTER_API_KEY="your_twitter_api_key"
    TWITTER_API_SECRET="your_twitter_api_secret"
    TWITTER_ACCESS_TOKEN="your_twitter_access_token"
    TWITTER_ACCESS_TOKEN_SECRET="your_twitter_access_token_secret"

    # Database URL for local PostgreSQL (from docker-compose.yml)
    DATABASE_URL="postgresql+asyncpg://user:password@db:5432/social_media_db"

    # Other optional settings (refer to backend/src/core/config.py)
    # ... (copy other settings from backend/src/core/config.py if needed)
    ```
    *You can generate a Gemini API key from [Google AI Studio](https://ai.google.dev/). For Twitter, apply for a Developer Account to get API keys and tokens.*

3.  **Start the services:**
    Navigate to the project root directory and run:
    ```bash
    docker-compose up --build
    ```
    This will build the Docker images, start the PostgreSQL database, backend, and frontend services.

    *   The backend API will be accessible at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.
    *   The frontend application will typically be accessible at `http://localhost:3000`.

### GCP Cloud Run Deployment

To deploy the application to Google Cloud Platform (GCP) using Cloud Run:

1.  **GCP Project Setup:**
    *   Ensure you have a GCP project created and the `gcloud` CLI installed and authenticated.
    *   Enable the following GCP APIs in your project: Cloud Run API, Secret Manager API, Artifact Registry API, and Cloud Run Job API.

2.  **Configure `gcloud` CLI:**
    Set your GCP project ID and desired region:
    ```bash
    gcloud config set project [YOUR_GCP_PROJECT_ID]
    gcloud config set region [YOUR_GCP_REGION] # e.g., us-central1
    ```
    Alternatively, you can set these as environment variables before running the deploy script:
    ```bash
    export PROJECT_ID="[YOUR_GCP_PROJECT_ID]"
    export REGION="[YOUR_GCP_REGION]"
    ```

3.  **Create GCP Secrets:**
    You **must** create the following secrets in GCP Secret Manager. These will be used by the `deploy.sh` script to configure your Cloud Run services securely.
    *   `POSTGRES_USER`
    *   `POSTGRES_PASSWORD`
    *   `POSTGRES_DB`
    *   `GOOGLE_API_KEY`
    *   `TWITTER_API_KEY`
    *   `TWITTER_API_SECRET`
    *   `TWITTER_ACCESS_TOKEN`
    *   `TWITTER_ACCESS_TOKEN_SECRET`

    You can create secrets via the GCP Console or using the `gcloud` CLI:
    ```bash
    echo "your_postgres_user" | gcloud secrets create POSTGRES_USER --data-file=- --project=[YOUR_GCP_PROJECT_ID]
    echo "your_postgres_password" | gcloud secrets create POSTGRES_PASSWORD --data-file=- --project=[YOUR_GCP_PROJECT_ID]
    echo "your_postgres_db_name" | gcloud secrets create POSTGRES_DB --data-file=- --project=[YOUR_GCP_PROJECT_ID]
    echo "your_google_api_key" | gcloud secrets create GOOGLE_API_KEY --data-file=- --project=[YOUR_GCP_PROJECT_ID]
    # ... and so on for all Twitter API keys
    ```

4.  **Run the Deployment Script:**
    Navigate to the project root directory and execute the `deploy.sh` script:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```
    The script will:
    *   Build and push Docker images to Google Container Registry (GCR).
    *   Deploy the PostgreSQL database, backend, and frontend services to Cloud Run.
    *   Run a Cloud Run Job to initialize the PostgreSQL database.
    *   Output the URLs for your deployed frontend and backend services.

    **Important:** Ensure you have the necessary IAM permissions for Cloud Run, Secret Manager, and Artifact Registry in your GCP project.


## Usage

### Backend API Endpoints

You can interact with the backend API using `curl`, Postman, Insomnia, or through the Swagger UI (`http://localhost:8000/docs`).

-   **`POST /api/v1/content/generate`**: Generate a new social media post.
-   **`POST /api/v1/content/approve/{post_id}`**: Approve a generated post.
-   **`GET /api/v1/content/posts`**: Retrieve all stored posts.
-   **`POST /api/v1/scheduling/schedule/{post_id}`**: Schedule a specific approved post.
-   **`GET /api/v1/analytics/metrics`**: Retrieve mock engagement metrics.

### Frontend Application

Interact with the intuitive web interface to:
-   Input prompts for AI content generation.
-   Preview, approve, and discard generated posts.
-   View and manage scheduled posts.
-   Visualize mock analytics data.

## Documentation

*   **Software Requirements Specification (SRS):** [docs/SocialMediaAutomationSRS.markdown](docs/SocialMediaAutomationSRS.markdown)
*   **Research and Functional Breakdown:** [docs/SocialMediaManagerResearch.markdown](docs/SocialMediaManagerResearch.markdown)

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Dagmawi Teferi - [Your LinkedIn/GitHub Profile] - dagmawi.teferi@example.com

Project Link: [https://github.com/your-username/social-media-agent](https://github.com/your-username/social-media-agent)