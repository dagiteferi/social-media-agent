# Project Documentation: AI Social Media Agent

**Version**: 1.0
**Date**: September 30, 2025

## 1. Introduction

This document provides a comprehensive overview of the AI Social Media Agent, a full-stack application designed to automate the role of a Social Media Manager for e-commerce brands.

The system automates content creation, post scheduling, and performance analytics, aiming to reduce manual effort and increase social media engagement. It is built using a modern tech stack and integrates with third-party AI and social media APIs.

## 2. System Architecture

The application follows a classic client-server architecture, with a decoupled frontend and backend. The entire system is containerized using Docker for consistency across development and production environments.

### 2.1 Tech Stack

*   **Frontend**: A responsive web application built with **React** and **TypeScript**, using **Vite** for tooling. UI components are from **shadcn/ui**, and styling is done with **Tailwind CSS**.
*   **Backend**: A robust API server built with **Python** and the **FastAPI** framework.
*   **Database**: A **PostgreSQL** database is used for persistent data storage, such as posts, schedules, and analytics.
*   **Containerization**: **Docker** and **Docker Compose** are used to manage the application's services (`frontend`, `backend`, `db`).

### 2.2 Architecture Diagram

```
[User] --> [React UI (Browser)]
    |
    | (HTTP/JSON)
    v
[FastAPI Backend (Docker)] <--> [PostgreSQL DB (Docker)]
    |
    | (HTTPS)
    v
[Third-Party APIs]
    - Gemini API (for AI content generation)
    - Twitter API (for posting)
```

## 3. Core Features

The agent's functionalities are broken down into three main areas:

### 3.1 Content Management

*   **AI-Powered Generation**: Users can provide a simple text prompt (e.g., "a post about our new shoe line"), and the agent uses the **Gemini API** to generate engaging, ready-to-use post content.
*   **Post Dashboard**: All generated posts are displayed on a central dashboard where they can be reviewed.
*   **Approval Workflow**: Posts must be explicitly approved before they can be scheduled or published, giving the user full control.

### 3.2 Scheduling & Publishing

*   **Immediate Publishing**: Approved posts can be published to Twitter instantly with a single click.
*   **Scheduled Publishing**: Posts can be scheduled to be published at a future date and time (Note: The backend supports this, with a scheduler service that runs periodically).

### 3.3 Analytics

*   **Performance Metrics**: The application tracks and displays key engagement metrics for published posts, such as likes and retweets (currently mocked, but with infrastructure in place for real data).

## 4. Getting Started

### 4.1 Prerequisites

*   Docker and Docker Compose
*   Access to Google Gemini and Twitter Developer APIs
*   Git

### 4.2 Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd social-media-agent
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the `infrastructure/` directory by copying the `backend/src/.env.example`. Populate it with your credentials:
    ```
    # infrastructure/.env
    POSTGRES_DB=your_db_name
    POSTGRES_USER=your_db_user
    POSTGRES_PASSWORD=your_db_password

    # API Keys
    GOOGLE_API_KEY=your_gemini_api_key
    TWITTER_API_KEY=your_twitter_api_key
    TWITTER_API_KEY_SECRET=your_twitter_api_secret
    TWITTER_ACCESS_TOKEN=your_twitter_access_token
    TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret
    ```

3.  **Build and Run the Application:**
    From the `infrastructure/` directory, run the following command:
    ```bash
    docker-compose up --build
    ```

4.  **Access the Application:**
    *   **Frontend**: `http://localhost:3000`
    *   **Backend API**: `http://localhost:8000/docs` (for interactive API documentation)
