# Software Requirements Specification for AI-Driven Social Media Manager Automation in E-Commerce

**Document Version**: 1.0  
**Author**: Dagmawi Teferi, 
**Date**: September 29, 2025  

## 1. Introduction
### 1.1 Purpose
This Software Requirements Specification (SRS), compliant with IEEE 830-1998, defines the functional and non-functional requirements for an AI-driven automation system for a Social Media Manager role in the e-commerce industry (e.g., fashion retail). The system automates high-impact tasks to reduce manual effort by 50 to 60 percent and increase engagement by 250 percent, as per 1Digital Agency benchmarks. It serves as a blueprint for implementation within a 24-hour timeframe, using free-tier APIs and GCP Always Free Tier, aligning with the evaluation criteria of value proposition, automation effectiveness, technical execution, and problem-solving adaptability.

### 1.2 Scope
The system, named **E-Commerce Social Media Agent (ESMA)**, automates content generation, post scheduling, and basic analytics for e-commerce brands on Twitter. It includes a React-based web interface for user interaction and a FastAPI backend for API orchestration, deployed on GCP Cloud Run with a PostgreSQL database. The agent targets repetitive tasks, saving 15 to 20 hours weekly and boosting conversions by 15 percent. Out-of-scope tasks include paid advertising, advanced crisis management, and integrations requiring paid services.

### 1.3 Definitions, Acronyms, and Abbreviations
* **ESMA**: E-Commerce Social Media Agent.
* **GCP**: Google Cloud Platform.
* **API**: Application Programming Interface.
* **UI**: User Interface.
* **KPI**: Key Performance Indicator (e.g., likes, retweets, conversions).
* **ROAS**: Return on Ad Spend.
* **Free Tier**: Services with no billing (e.g., Gemini API, Twitter API, GCP Always Free Tier).

### 1.4 References
* Research Document: SocialMediaManagerResearch.md (artifact_id: 4ea102b2-7d10-41e5-8f34-f63d37e9302f).
* Industry Sources:
  - [1Digital Agency E-Commerce Social Media](https://www.1digitalagency.com/social-media-management/)
  - [Sprout Social E-Commerce Strategy](https://sproutsocial.com/insights/social-media-for-ecommerce/)
  - [Statista Social Commerce Market](https://www.statista.com/topics/7717/social-commerce/)
  - [Indeed Social Media Manager Role](https://www.indeed.com/hire/job-description/social-media-manager)
* Tools:
  - [Google AI Studio](https://ai.google.dev)
  - [Twitter Developer Portal](https://developer.twitter.com)
  - [GCP Cloud Run](https://cloud.google.com/run)

### 1.5 Overview
Section 2 details the system’s context, role selection rationale, and constraints. Section 3 specifies functional and non-functional requirements, including tasks, workflows, and technical architecture. Section 4 outlines assumptions and dependencies.

## 2. Overall Description
### 2.1 Product Perspective
ESMA is a standalone, cloud-hosted system integrating with Gemini API for content generation and Twitter API for scheduling, deployed on GCP Cloud Run with a PostgreSQL database. It operates within free-tier limits, ensuring accessibility. The system replaces manual content creation and scheduling, complementing human oversight for strategic tasks.

### 2.2 Product Functions
* **Content Generation**: Creates Twitter posts from user prompts (e.g., "Promote new sneaker launch").
* **Post Scheduling**: Queues and schedules approved posts for optimal times.
* **Analytics Display**: Provides a dashboard with mock metrics (likes, retweets) due to free-tier limitations, with post data stored in PostgreSQL.
* **User Interaction**: Enables prompt entry, post approval, and monitoring via a web UI.

### 2.3 User Classes and Characteristics
* **Primary User**: E-commerce business owners or marketing managers, non-technical, needing intuitive tools to manage social media.
* **Secondary User**: Developers or technical staff reviewing automation logs or extending functionality.

### 2.4 Operating Environment
* **Frontend**: Browser-based React application, compatible with Chrome, Firefox, and mobile devices.
* **Backend**: FastAPI server in a Docker container, hosted on GCP Cloud Run with a PostgreSQL database.
* **Constraints**: Free-tier APIs (Gemini: 1,500 requests/day; Twitter: 1,500 posts/month) and GCP Always Free Tier (Cloud Run: 180,000 vCPU-seconds/month).

### 2.5 Design and Implementation Constraints
* Must use free-tier APIs and GCP resources to avoid billing.
* 24-hour development timeline limits scope to core automation tasks.
* Regional access restrictions in Ethiopia may require contacting Kidus for support.

### 2.6 Assumptions and Dependencies
* **Assumptions**: Users have access to Google AI Studio and Twitter Developer Portal; basic familiarity with web UIs.
* **Dependencies**: Gemini API for content, Twitter API for scheduling, GCP for hosting and automation.

## 3. Specific Requirements
### 3.1 External Interface Requirements
#### 3.1.1 User Interfaces
* **UI-1**: Input field for text prompts (e.g., "Create post for winter sale").
* **UI-2**: Post preview panel with approve/reject buttons.
* **UI-3**: Dashboard displaying scheduled posts and mock metrics (likes, retweets).
* **UI-4**: Error messages for API failures or invalid inputs.
* **Accessibility**: Keyboard navigation, screen reader support, mobile-responsive design.

#### 3.1.2 Hardware Interfaces
* None; cloud-based system accessed via standard browsers.

#### 3.1.3 Software Interfaces
* **SI-1**: Gemini API (v1beta, HTTPS POST) for content generation.
* **SI-2**: Twitter API (v2, OAuth-authenticated POST) for scheduling and basic metrics.
* **SI-3**: GCP Cloud Run for hosting frontend and backend.

#### 3.1.4 Communications Interfaces
* HTTP/HTTPS for frontend backend communication and API calls.
* JSON for data exchange between components and APIs.

### 3.2 Functional Requirements
#### 3.2.1 Content Generation (FR-1)
* **Description**: Generate Twitter posts based on user prompts.
* **Input**: Text prompt (e.g., "Promote winter sale").
* **Process**: Send prompt to Gemini API, parse response, store in memory.
* **Output**: Post content (e.g., "Winter Sale! 20 percent off jackets. #ShopNow").
* **Priority**: High (drives 70 percent of engagement per 1Digital Agency).

#### 3.2.2 Post Scheduling (FR-2)
* **Description**: Schedule approved posts for optimal times.
* **Input**: Approved post ID from UI.
* **Process**: Queue post, trigger via Twitter API.
* **Output**: Scheduled post on Twitter; status update in UI.
* **Priority**: High (saves 10 hours/week).

#### 3.2.3 Analytics Display (FR-3)
* **Description**: Display mock engagement metrics in the dashboard.
* **Input**: None (mock data due to free-tier limits).
* **Process**: Generate random metrics (likes: 0-100, retweets: 0-50), display in UI.
* **Output**: Visual charts in dashboard.
* **Priority**: Medium (enhances user experience).

#### 3.2.4 User Interaction (FR-4)
* **Description**: Provide intuitive UI for prompt entry, approval, and monitoring.
* **Input**: User prompts, approval clicks.
* **Process**: Handle inputs via React, call backend APIs, update UI state.
* **Output**: Real-time post previews, status updates, metrics.
* **Priority**: High (ensures usability).

### 3.3 Performance Requirements
* **PR-1**: API responses within 2 seconds (95th percentile).
* **PR-2**: UI rendering within 1 second on standard browsers.
* **PR-3**: Handle 50 daily posts within free-tier limits.

### 3.4 Design Constraints
* **DC-1**: No billing-enabled services; use GCP Always Free Tier.
* **DC-3**: 24-hour implementation timeline.

### 3.5 Software System Attributes
#### 3.5.1 Reliability
* Error handling for API failures (e.g., retry logic for rate limits).
* Logging for debugging and audit trails.

#### 3.5.2 Availability
* 99.9 percent uptime via Cloud Run’s managed infrastructure.
* Graceful degradation if APIs are unavailable (mock responses).

#### 3.5.3 Security
* API keys securely managed via GCP Secret Manager and injected as environment variables.
* No sensitive user data processed.

#### 3.5.4 Maintainability
* Modular code (React components, FastAPI routes) for easy updates.
* Documentation in code and SRS for future extensions.

#### 3.5.5 Usability
* Intuitive UI with clear prompts and feedback.
* Supports non-technical users (e.g., e-commerce owners).

### 3.6 Other Requirements
* **OR-1**: Compliance with Twitter and Gemini API terms.
* **OR-2**: Documentation for setup and usage included in deliverables.

## 4. Supporting Information

### 4.2 Assumptions
* Access to Google AI Studio and Twitter Developer Portal.
* Basic user familiarity with web interfaces.
* No regional restrictions for API or GCP access in Ethiopia.

### 4.3 Risks and Mitigation
* **Risk**: Twitter API OAuth setup delays.
  - **Mitigation**: Mock scheduling response; note in video.
* **Risk**: Regional access issues.
  - **Mitigation**: Contact Kidus on LinkedIn immediately.
* **Risk**: API rate limits.
  - **Mitigation**: Implement retry logic; cache responses.

### 4.4 Deliverables
* Source code (React `index.html`, FastAPI `main.py`, `Dockerfile`, `requirements.txt`).
* SRS (this document).
* 5-7 minute video presentation (problem, thought process, demo, code walkthrough).

## Appendix A: Role Selection Rationale
**Role**: Social Media Manager in e-commerce.  
**Why Chosen**:
* **Impact**: Drives 20-30 percent of e-commerce sales; 70 percent engagement from content/scheduling (1Digital Agency).
* **Automatability**: Free-tier APIs (Gemini, Twitter) enable content generation and scheduling.
* **Skill Alignment**: Matches my Kifiya experience (FastAPI APIs, RAG pipelines) and Purpose Black ET frontend work.
* **Feasibility**: Scoped for 24 hours, avoiding complex roles (e.g., product manager) or paid APIs (e.g., recruiter).

## Appendix B: System Architecture Diagram
```
[User] --> [React UI: Prompt Input, Dashboard]
    | HTTP/JSON
    v
[FastAPI Backend] --> [Gemini API: Content Generation]
    |              --> [Twitter API: Post Scheduling]
    |              --> [PostgreSQL Database]
    v
[GCP Cloud Run: Hosting]
```

## Appendix C: Your Notes
Add comments or refinements here for implementation:
