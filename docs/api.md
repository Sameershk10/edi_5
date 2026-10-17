# REST API Reference: Autonomous Voice Calling Platform

Vishwakarma Institute of Technology | Semester V Capstone Project (TY_E_13)

## Base URL
- Production / Development: `http://localhost:3000/api`
- FastAPI Documentation: `http://localhost:8000/docs`

---

## 1. Authentication
### `POST /api/auth/login`
- **Body**: `{ "email": "admin@vit.edu", "password": "password123" }`
- **Response**: JWT bearer token and user metadata.

### `GET /api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Active user profile and academic evaluation role.

---

## 2. Customer Management
### `GET /api/customers`
- **Query Params**: `search`, `language`, `campaign`, `status`
- **Response**: List of customer records with pagination count.

### `POST /api/customers`
- **Body**:
  ```json
  {
    "name": "Rahul Sharma",
    "phone_number": "+919876543210",
    "email": "rahul.sharma@example.com",
    "preferred_language": "Hindi",
    "preferred_call_time": "17:00",
    "campaign_id": "camp-1",
    "notes": "Cardiology appointment"
  }
  ```

### `POST /api/customers/import`
- **Body**:
  ```json
  {
    "csvText": "name,phone,email,preferred_language,preferred_call_time,campaign,status,notes\nRahul Sharma,+919876543210,rahul@example.com,Hindi,17:00,Appointment Reminder,pending,Dentist",
    "defaultCampaignId": "camp-1"
  }
  ```

---

## 3. Campaigns
### `GET /api/campaigns`
- **Response**: Campaign details, progress counters, and status.

### `POST /api/campaigns`
- **Body**: Name, objective, calling window hours, max attempts, language.

### `POST /api/campaigns/:id/start`
- **Response**: Enqueues eligible pending customer calls into the queue.

---

## 4. Voice Calling Engine
### `POST /api/calls/initiate`
- **Body**: `{ "customer_id": "cust-101", "campaign_id": "camp-1" }`
- **Response**:
  ```json
  {
    "call": {
      "id": "call-101",
      "status": "in_progress",
      "detected_language": "Hindi",
      "dialogue_state": "GREETING"
    },
    "greeting": "नमस्ते Rahul Sharma जी, मैं एबीसी सर्विसेज से बात कर रहा हूँ..."
  }
  ```

### `POST /api/calls/:id/interact`
- **Body**: `{ "text": "Haan confirm kar do." }`
- **Response**:
  ```json
  {
    "agent_response": "बहुत-बहुत धन्यवाद! आपकी पुष्टि दर्ज कर ली गई है।",
    "intent": "CONFIRMATION",
    "detected_language": "Hindi",
    "sentiment": "positive",
    "next_state": "COMPLETED",
    "action_executed": {
      "action": "confirm_appointment",
      "result": "Appointment status marked as confirmed in database"
    },
    "latency_ms": 280
  }
  ```

---

## 5. Knowledge Base & RAG
### `GET /api/knowledge`
- Returns all knowledge documents, categories, and indexed chunks.

### `POST /api/knowledge/search`
- **Body**: `{ "query": "What are the clinic timings?" }`
- **Response**: Matched chunks scored by semantic overlap.

---

## 6. Analytics
### `GET /api/analytics`
- Returns KPI totals, intent breakdown, language distribution (English, Hindi, Marathi, Hinglish), duration metrics, and academic benchmarks (WER, F1).
