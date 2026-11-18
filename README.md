# AI Log Analyzer

An intelligent, full-stack web application designed to instantly parse, triage, and diagnose raw system error logs, stack traces, and crash reports using Google Gemini AI. 
It transforms unstructured debugging data into clean, structured JSON insights containing categories, severities, root causes, and step-by-step remediation guides.

---

## Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Use Cases](#-use-cases)
3. [Architecture](#-architecture)
4. [Technology Stack](#-technology-stack)
5. [AI Integration](#-ai-integration)
6. [Prompt Engineering](#-prompt-engineering)
7. [Setup](#-setup)
8. [Environment Variables](#-environment-variables)
9. [Running the Application](#-running-the-application)
10. [Sample Inputs](#-sample-inputs)
11. [Testing Approach](#-testing-approach)
12. [Error Handling](#-error-handling)
13. [AI Usage During Development](#-ai-usage-during-development)
14. [Limitations](#-limitations)
15. [Future Improvements](#-future-improvements)

---

## 🚀 Problem Statement
Developers, DevOps engineers, and system administrators waste countless hours manually deciphering verbose, unstructured, and cryptic error logs during production incidents and deployment failures. Identifying the root cause requires switching contexts, analyzing stack traces line by line, and searching through documentation. **AI Log Analyzer** bridges this gap by leveraging generative AI to automate log triage, delivering instant, actionable diagnostics in a clean, developer-friendly interface.

---

## 🎯 Use Cases
* **Production Incident Triage:** Instantly analyze live server crash reports or exception stack traces to determine severity and immediate mitigation steps.
* **Database & Network Debugging:** Quickly diagnose connection pool timeouts, socket hangups, or query failures.
* **CI/CD Pipeline Failure Analysis:** Paste build error logs from GitHub Actions or Jenkins to pinpoint compilation or dependency breakages.
* **Junior Developer Mentorship:** Help junior engineers understand complex error codes and learn industry-standard debugging methodologies.

---

## 🏗️ Architecture
The application follows a clean single-page client-server architecture:
1. **Frontend (React SPA):** Provides an aesthetic, minimalist workspace with a large scrollable input textarea for error logs and a scrollable JSON response viewer. Communicates asynchronously via **TanStack React Query**.
2. **Backend (Node.js & Express):** Exposes a POST endpoint (`/api/analyze`) that receives the raw log payload, securely interfaces with the Google Gemini API, parses the response, and returns structured JSON.
3. **AI Layer (Google Gemini):** Processes the log text through strict prompt instructions to guarantee a uniform JSON schema output.

+------------------+         POST /api/analyze         +-------------------+         Google Gemini API         +-----------------------+
|  React Frontend  | --------------------------------> |  Express Backend  | --------------------------------> | gemini-3.5-flash-lite |
|  (Tailwind / RQ) | <-------------------------------- |                   | <-------------------------------- |                       |
+------------------+           JSON Response           +-------------------+         Structured JSON           +-----------------------+

---

## 💻 Technology Stack
* **Frontend:** React (JavaScript), Tailwind CSS, TanStack React Query (`@tanstack/react-query`)
* **Backend:** Node.js, Express.js
* **Middleware & Utilities:** `cors`, `dotenv`
* **AI Model:** Google Gemini API (`gemini-3.5-flash-lite`)

---

## 🤖 AI Integration
The backend utilizes the Google Gemini SDK to interact with the **`gemini-3.5-flash-lite`** model. 
This model was chosen for its exceptional speed, low latency, cost-efficiency (free tier availability), and strong reasoning capabilities required for technical log analysis.

---

## ✍️ Prompt Engineering
To ensure the backend consistently receives clean, parseable JSON without unwanted markdown backticks or conversational filler, the system prompt enforces a rigid output structure:

* **Role:** You are a senior software debugging assistant.
* **Task:** Analyze the provided error log and extract diagnostic metadata.
* **Required Output Schema:**
  ```json
  {
    "errorType": "string",
    "category": "string",
    "severity": "LOW | MEDIUM | HIGH | CRITICAL",
    "rootCause": "string",
    "fixRecommendation": "string",
    "debuggingSteps": ["step 1", "step 2"]
  }

  
⚙️ Setup
Prerequisites
Node.js (v18+ recommended)
npm or yarn

Installation Steps
Clone the repository:

Bash
git clone [REPO_URL]
cd AI-Log-Analyzer

Set up the Backend:
Bash
cd server
npm install

Set up the Frontend:
Bash
cd ../client
npm install


🔐 Environment Variables
Create a .env file in the root of your server directory with the following variables:
PORT=5000
GEMINI_API_KEY=your_google_gemini_api_key_here


🏃‍♂️ Running the Application
Start the Backend Server:
Bash
cd backend
node server.js
# Server runs on http://localhost:5000

Start the Frontend Development Server:
Bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173


📋 Sample Inputs
Input Error Log:
Plaintext
Database connection failed (Timeout): Error: Connection pool timeout after 10000ms. Failed to acquire client from pool. Host: db.internal.cluster:5432. Active connections: 50/50.
    at Pool.acquire (/app/node_modules/pg-pool/index.js:45:21)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    
Expected JSON Output:
JSON
{
  "errorType": "Database Connection Timeout",
  "category": "Database/Network",
  "severity": "HIGH",
  "rootCause": "The application exhausted its connection pool limit (50/50 active connections) and failed to acquire a new database client within the 10000ms timeout threshold.",
  "fixRecommendation": "Increase the connection pool limit, optimize slow running queries holding onto connections, or check for connection leaks in the application code.",
  "debuggingSteps": [
    "Check database server resource utilization and active connections.",
    "Review application database connection pooling configuration.",
    "Inspect slow query logs to identify long-running transactions."
  ]
}


🧪 Testing Approach
API Testing: Tested endpoint payloads (POST /api/analyze) using Postman and cURL to verify error handling and JSON validity.
Frontend Mutation Testing: Validated loading spinners, disabled button states during pending requests, and error boundary states using TanStack React Query (isPending, isError, isSuccess).
Robust Parsing: Implemented regex sanitization on backend/frontend to strip accidental markdown block wrappers (```json) returned by LLM generations.

🛡️ Error Handling
Backend: Try-catch blocks wrap the Gemini API invocation. If the AI model fails or returns malformed text, an HTTP 500 status with a structured error message is returned.
Frontend: React Query catches network failures and displays error feedback in red text within the response container, preventing app crashes.

🤖 AI Usage During Development
Used LLM assistance to scaffold responsive Tailwind CSS layouts optimized for single-page viewport fitting.
Refined regular expression patterns for cleaning markdown-wrapped JSON outputs from generative model responses.

⚠️ Limitations
Subject to Google Gemini free tier rate limits and quotas.
Extremely massive multi-megabyte log files may exceed token context limits; logs should be truncated to relevant stack traces.

🔮 Future Improvements
Log History & Sessions: Save past analysis queries in local storage or a lightweight database.
File Upload Support: Allow users to upload .log, .txt, or .json log files directly.
Severity Alerts: Webhook integration for Slack or PagerDuty when analyzing CRITICAL logs.
