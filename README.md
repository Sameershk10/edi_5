# AI-Based Autonomous Voice Calling Agent for Intelligent Customer Interaction

**Vishwakarma Institute of Technology, Pune (VIT Pune)**  
**Department of Artificial Intelligence & Data Science**  
**Academic Year:** 2025-26 | **Semester:** V | **Group No:** TY_E_13  
**Project Guide:** Dr. Viomesh Kumar Singh  
**Group Members:**
- Omkar Raskar (Roll No. 65, G.R. No. 12415189)
- Prathamesh Kumbhare (Roll No. 26, G.R. No. 12414476)
- Sameer Shaikh (Roll No. 58, G.R. No. 12411895)
- Vidhi Rahangdale (Roll No. 31, G.R. No. 12411132)
- Sandesh Rabade (Roll No. 29, G.R. No. 12410999)

---

## 1. Project Overview
This academic capstone project introduces an end-to-end autonomous voice calling platform engineered to autonomously initiate outbound customer calls, conduct dynamic multi-turn conversations in Indic languages (English, Hindi, Marathi, and Hinglish code-switching), classify customer intents, perform grounded RAG information retrieval, and execute backend database actions (such as appointment confirmation, callback scheduling, and supervisor escalation).

---

## 2. Key Capabilities
- **Multilingual Telephony & Code-Switching**: Native understanding and response synthesis in English, Hindi, Marathi, and Hinglish.
- **Autonomous Outbound Scheduler**: Priority queue with calling hour compliance (e.g., 09:00 - 19:00), customer time preferences, and retry limits.
- **Gemini 3.8 Flash LLM Reasoning**: Grounded reasoning with strict Pydantic JSON schemas.
- **RAG Knowledge Base**: Semantic retrieval over clinic timings, policies, doctor schedules, and pricing.
- **Controlled Business Actions**:
  - `confirm_appointment(customer_id)`
  - `schedule_callback(customer_id, time, reason)`
  - `escalate_to_human(call_id, reason)`
  - `update_customer_status(customer_id, status)`
- **Complete Mock Telephony Mode**: Works out of the box without paid external APIs (Twilio/Pinecone), with live browser microphone STT and audio playback.
- **Enterprise Analytics Dashboard**: Tracks total calls, completion rate, intent distributions, language ratios, sentiment metrics, and response latencies.

---

## 3. Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Speech Recognition & Speech Synthesis API.
- **Backend**: Express + Node.js (with full TypeScript engine) & FastAPI (Python 3.10+).
- **AI Core**: Google Gemini 3.8 Flash (`@google/genai`), Local Semantic Vector Retriever / ChromaDB / Pinecone.
- **Telephony**: Twilio Voice API (with Mock Telephony Gateway).
- **Database & Queue**: PostgreSQL, SQLAlchemy, Redis, RabbitMQ.
- **Containerization**: Docker, Docker Compose.

---

## 4. Quick Start

### Option A: Direct Node.js / Vite Server (Full Interactive Dashboard)
```bash
# 1. Install dependencies
npm install

# 2. Run the full-stack development server
npm run dev
# The application opens at http://localhost:3000
```

### Option B: Docker Compose
```bash
docker compose up --build
```

### Option C: Python FastAPI Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# OpenAPI Docs available at http://localhost:8000/docs
```

---

## 5. Running Tests
```bash
# Run backend pytest suite
pytest backend/tests/ -v
```

---

## 6. Demo Verification
Open the live dashboard at `http://localhost:3000`:
1. Navigate to **Customer CRM**: inspect pre-loaded customers or click **Import CSV** using `sample_customers.csv`.
2. Navigate to **Interactive Call Simulator**: Select **Rahul Sharma (Hindi)** or **Sneha Kulkarni (Marathi)**.
3. Click **Initiate Outbound Call**: observe the ring state, voice greeting, and live transcript.
4. Speak via microphone or click preset dialogue buttons (`"Haan confirm kar do"`, `"Mala udya sakali call kara"`).
5. Verify instant intent detection, language recognition, action execution, and updated database records.
