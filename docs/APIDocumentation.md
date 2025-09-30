# API Documentation

**Version**: 1.0
**Base URL**: `/api/v1`

This document provides details on the RESTful API for the AI Social Media Agent. The API is built with FastAPI.

---

## Content Management

Endpoints for generating, retrieving, and approving posts.

### 1. Generate New Post

- **Method**: `POST`
- **Path**: `/content/generate`
- **Description**: Generates new social media content using the Gemini API based on a user prompt. The generated post is saved to the database with `approved=false` and `is_posted=false`.
- **Position in Code**: `backend/src/api/endpoints/content.py`
- **Request Body**:
  ```json
  {
    "prompt": "A post about our new winter collection.",
    "agent_id": 1
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "id": "generated_post_id",
    "content": "❄️ Our new winter collection is here! Stay warm and stylish with our latest arrivals. #WinterFashion #NewCollection",
    "approved": false,
    "is_posted": false,
    "agent_id": 1
  }
  ```
- **Error Response (500 Internal Server Error)**:
  ```json
  {
    "detail": "Error generating post: <error_details>"
  }
  ```

### 2. Approve a Post

- **Method**: `POST`
- **Path**: `/content/approve/{post_id}`
- **Description**: Marks a post as approved. Optionally, a `scheduled_at` timestamp can be provided to schedule the post for a future time.
- **Position in Code**: `backend/src/api/endpoints/content.py`
- **Path Parameters**:
  - `post_id` (string): The unique identifier of the post to approve.
- **Request Body**:
  ```json
  {
    "scheduled_at": "2025-12-15T10:00:00Z"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```
- **Error Response (404 Not Found)**:
  ```json
  {
    "detail": "Post with id your_post_id not found"
  }
  ```

### 3. Get All Posts

- **Method**: `GET`
- **Path**: `/content/posts`
- **Description**: Retrieves a list of all social media posts from the database.
- **Position in Code**: `backend/src/api/endpoints/content.py`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "id": "post_id_1",
      "content": "First post content...",
      "approved": true,
      "is_posted": true,
      "agent_id": 1
    },
    {
      "id": "post_id_2",
      "content": "Second post content...",
      "approved": false,
      "is_posted": false,
      "agent_id": 1
    }
  ]
  ```

---

## Scheduling & Publishing

Endpoints for publishing content to social media.

### 1. Post Immediately

- **Method**: `POST`
- **Path**: `/scheduling/post_now/{post_id}`
- **Description**: Immediately publishes an approved post to Twitter. The post must be approved (`approved=true`) and not already posted (`is_posted=false`).
- **Position in Code**: `backend/src/api/endpoints/scheduling.py`
- **Path Parameters**:
  - `post_id` (string): The unique identifier of the post to publish.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Post sent to Twitter successfully."
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "detail": "Post is not approved"
  }
  ```

---

## Analytics

Endpoints for retrieving performance metrics.

### 1. Get Engagement Metrics

- **Method**: `GET`
- **Path**: `/analytics/metrics`
- **Description**: Retrieves a list of mock engagement metrics (likes, retweets) for all posts.
- **Position in Code**: `backend/src/api/endpoints/analytics.py`
- **Success Response (200 OK)**:
  ```json
  [
    {
      "post_id": "post_id_1",
      "likes": 120,
      "retweets": 35
    },
    {
      "post_id": "post_id_2",
      "likes": 88,
      "retweets": 12
    }
  ]
  ```
