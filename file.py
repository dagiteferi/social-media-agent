import os

# Base directory (your existing folder)
BASE_DIR = "social-media-agent"

# Define the folder structure inside the root folder
folders = [
    "backend/src/api/endpoints",
    "backend/src/api/models",
    "backend/src/api/services",
    "backend/src/core",
    "backend/tests",
    "frontend/public",
    "frontend/src/components",
    "frontend/src/styles",
    "frontend/src/api",
    "docs"
]

files = {
    "backend/src/api/__init__.py": "",
    "backend/src/api/endpoints/content.py": "# Content generation routes (Gemini API)\n",
    "backend/src/api/endpoints/scheduling.py": "# Post scheduling routes (Twitter API)\n",
    "backend/src/api/endpoints/analytics.py": "# Mock metrics routes\n",
    "backend/src/api/models/__init__.py": "",
    "backend/src/api/models/post.py": "# Post data model\n",
    "backend/src/api/services/__init__.py": "",
    "backend/src/api/services/gemini_service.py": "# Gemini API integration\n",
    "backend/src/api/services/twitter_service.py": "# Twitter API integration\n",
    "backend/src/api/services/storage_service.py": "# In-memory storage\n",
    "backend/src/core/__init__.py": "",
    "backend/src/core/config.py": "# Environment variables, API keys\n",
    "backend/src/core/logging.py": "# Logging setup\n",
    "backend/src/main.py": "# FastAPI app entry point\n",
    "backend/src/requirements.txt": "# Python dependencies\n",
    "backend/src/Dockerfile": "# Backend Docker configuration\n",
    "backend/src/.env.example": "# Sample environment file\n",
    "backend/tests/__init__.py": "",
    "backend/tests/test_content.py": "# Unit tests for content generation\n",
    "backend/tests/test_scheduling.py": "# Unit tests for scheduling\n",
    "backend/tests/test_analytics.py": "# Unit tests for analytics\n",

    "frontend/public/index.html": "<!-- React entry point -->\n",
    "frontend/public/favicon.ico": "",

    "frontend/src/components/PromptInput.js": "// Prompt input component\n",
    "frontend/src/components/PostPreview.js": "// Post preview and approval component\n",
    "frontend/src/components/Dashboard.js": "// Metrics dashboard component\n",

    "frontend/src/styles/tailwind.css": "/* Tailwind CSS configuration */\n",
    "frontend/src/App.js": "// Main React app\n",
    "frontend/src/index.js": "// React entry point\n",
    "frontend/src/api/api.js": "// API call functions\n",

    "frontend/package.json": "{\n  \"name\": \"frontend\",\n  \"dependencies\": {}\n}\n",
    "frontend/Dockerfile": "# Frontend Docker configuration\n",
    "frontend/.env.example": "# Sample environment file\n",

    "docs/SocialMediaManagerResearch.md": "# Research document (artifact_id: 4ea102b2-7d10-41e5-8f34-f63d37e9302f)\n",
    "docs/SocialMediaAutomationSRS.md": "# SRS document (artifact_id: 68371d10-3136-4e7b-9fb4-d67e25c799b5)\n",

    ".gitignore": "# Git ignore file\n",
    "README.md": "# Project setup and usage\n",
    "deploy.sh": "# Deployment script for GCP\n"
}

# Create folders
for folder in folders:
    os.makedirs(os.path.join(BASE_DIR, folder), exist_ok=True)

# Create files
for filepath, content in files.items():
    full_path = os.path.join(BASE_DIR, filepath)
    with open(full_path, "w") as f:
        f.write(content)

print("✅ Folder structure created inside social-media-agent/")
