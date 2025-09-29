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

The **E-Commerce Social Media Agent (ESMA)** is an AI-driven automation solution designed to empower e-commerce brands by streamlining their social media management, specifically for Twitter. This project aims to significantly reduce manual effort in content creation and scheduling, allowing businesses to focus on strategic growth while maintaining a consistent and engaging online presence.

Developed as part of a full-stack AI web developer assignment, ESMA showcases a robust, modular, and scalable architecture that leverages cutting-edge AI and cloud technologies, all while adhering to free-tier resource constraints.

## Features

-   **AI-Powered Content Generation:** Generate engaging Twitter posts using Google's Gemini API based on user prompts.
-   **Content Validation:** Automatically validates generated content against Twitter's character limits.
-   **Post Management:** Create, approve, and retrieve social media posts through a dedicated backend API.
-   **Automated Scheduling:** Schedule approved posts to Twitter via the Twitter API, with retry mechanisms for robustness.
-   **Daily Scheduling Trigger:** An endpoint to automatically schedule all approved and unscheduled posts (e.g., via Cloud Scheduler).
-   **Mock Analytics:** Provides mock engagement metrics (likes, retweets) for posts.
-   **Modular & Scalable Backend:** Built with FastAPI, organized into services, endpoints, and a `langgraph`-based AI workflow.
-   **Intuitive Frontend (Planned):** A responsive web UI for seamless interaction, post preview, approval, and analytics visualization.

## Technology Stack

**Backend:**
-   **Framework:** FastAPI
-   **Language:** Python 3.x
-   **AI/LLM:** Google Gemini API
-   **Social Media API:** Twitter API v2
-   **Workflow Orchestration:** `langgraph`
-   **Configuration:** `pydantic-settings`
-   **HTTP Client:** `requests`
-   **ASGI Server:** `uvicorn`

**Frontend (Planned):**
-   **Framework:** React (JavaScript/TypeScript)
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS / Bootstrap
-   **State Management:** React Context API / Zustand / Jotai
-   **Routing:** React Router DOM
-   **API Interaction:** Axios / Fetch API
-   **Charting:** Recharts / Chart.js
-   **Icons:** React Icons / Font Awesome

**Deployment (Planned):**
-   **Cloud Platform:** Google Cloud Platform (GCP) Always Free Tier
-   **Containerization:** Docker
-   **Hosting:** GCP Cloud Run
-   **Scheduling:** GCP Cloud Scheduler

## Architecture

The project follows a clear separation of concerns with a decoupled frontend and backend.

**Backend:**
The backend is a Python FastAPI application structured for modularity:
-   **`main.py`**: The application entry point, responsible for setting up middleware and including API routers.
-   **`api/endpoints/`**: Contains modular route definitions for `content`, `scheduling`, and `analytics`.
-   **`api/services/`**: Houses business logic and external API integrations (`gemini_service`, `twitter_service`, `storage_service`).
-   **`api/models/`**: Defines Pydantic models for data structures (`Post`).
-   **`api/api_config.py`**: Centralizes API-specific configurations (URLs, retry logic).
-   **`graphs/`**: Implements the AI workflow using `langgraph`, separating state, nodes, and workflow logic for clarity.
-   **`core/`**: Provides core utilities like configuration management (`config.py`) and logging (`logging.py`).

**Frontend (Planned):**
A React-based SPA will consume the backend APIs, providing a user-friendly interface for all interactions.

## Setup & Installation

### Prerequisites

Before you begin, ensure you have the following installed:
-   Python 3.8+
-   `pip` (Python package installer)
-   `npm` or `yarn` (for frontend development)
-   Git

### Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/social-media-agent.git
    cd social-media-agent/backend
    ```
2.  **Create a Python Virtual Environment:**
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  **Install Dependencies:**
    Create a `requirements.txt` file in the `backend/` directory with the following content:
    ```
    fastapi
    uvicorn[standard]
    pydantic
    pydantic-settings
    requests
    langgraph
    ```
    Then install:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory (alongside `src/` and `tests/`).
    Obtain your API keys and add them to the `.env` file:
    ```
    GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
    TWITTER_BEARER_TOKEN="YOUR_TWITTER_BEARER_TOKEN"
    ```
    *You can generate a Gemini API key from [Google AI Studio](https://ai.google.dev/). For Twitter, apply for a Developer Account to get a Bearer Token.*

5.  **Run the Backend Server:**
    Navigate to the `backend/` directory and run:
    ```bash
    uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
    ```
    The backend API will be accessible at `http://localhost:8000`. You can view the interactive API documentation at `http://localhost:8000/docs`.

### Frontend Setup

*(This section will be updated once the frontend is developed.)*

1.  Navigate to the `frontend/` directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install # or yarn install
    ```
3.  Run the frontend development server:
    ```bash
    npm run dev # or yarn dev
    ```
    The frontend application will typically be accessible at `http://localhost:5173` (or similar).

## Usage

### Backend API Endpoints

You can interact with the backend API using `curl`, Postman, Insomnia, or through the Swagger UI (`http://localhost:8000/docs`).

-   **`POST /api/v1/content/generate`**: Generate a new social media post.
-   **`POST /api/v1/content/approve/{post_id}`**: Approve a generated post.
-   **`GET /api/v1/content/posts`**: Retrieve all stored posts.
-   **`POST /api/v1/scheduling/schedule/{post_id}`**: Schedule a specific approved post.
-   **`POST /api/v1/scheduling/schedule_trigger`**: Manually trigger the daily scheduling process.
-   **`GET /api/v1/analytics/metrics`**: Retrieve mock engagement metrics.

### Frontend Application

*(This section will be updated once the frontend is developed.)*

Interact with the intuitive web interface to:
-   Input prompts for AI content generation.
-   Preview, approve, and discard generated posts.
-   View and manage scheduled posts.
-   Visualize mock analytics data.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Dagmawi Teferi - [Your LinkedIn/GitHub Profile] - dagmawi.teferi@example.com

Project Link: [https://github.com/your-username/social-media-agent](https://github.com/your-username/social-media-agent)