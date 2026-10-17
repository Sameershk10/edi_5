# System Architecture: AI-Based Autonomous Voice Calling Agent

Vishwakarma Institute of Technology, Pune (VIT Pune)  
Department of Artificial Intelligence & Data Science  
Academic Year: 2025-26 | Semester: V | Group No: TY_E_13  
Internal Guide: Dr. Viomesh Kumar Singh  

## High-Level Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                             CUSTOMER INGESTION                                |
|  [ CSV Import (sample_customers.csv) ]  --->  [ PostgreSQL Customer Table ]   |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                              CAMPAIGN SCHEDULER                               |
|  [ Campaign Rules ] ---> [ Scheduler Service ] ---> [ RabbitMQ Priority Queue]|
|                             ^ Redis State/Locks                               |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                            VOICE CALL WORKER                                  |
|  [ Dispatcher ] ---> [ Telephony Provider (Twilio / Mock Webhook Gateway) ]   |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                        REAL-TIME SPEECH & DIALOGUE LOOP                       |
|                                                                               |
|  Customer Speech (Audio)                                                      |
|         |                                                                     |
|         v                                                                     |
|  [ Speech-to-Text (Streaming STT Engine) ]                                    |
|         |                                                                     |
|         v                                                                     |
|  [ Language Identification (English / Hindi / Marathi / Hinglish) ]           |
|         |                                                                     |
|         v                                                                     |
|  [ Intent Classification & Sentiment Analysis ]                               |
|         |                                                                     |
|         v                                                                     |
|  [ Dialogue Manager (FSM: GREETING -> INTENT -> ACTION -> CLOSING) ]          |
|         |                                 ^                                   |
|         v                                 |                                   |
|  [ RAG Engine (Vector Knowledge Base) ] --+                                   |
|         |                                                                     |
|         v                                                                     |
|  [ Gemini 3.8 Flash LLM Reasoning ]                                           |
|         |                                                                     |
|         +---> [ Controlled Tool Execution ]                                   |
|         |        - confirm_appointment()                                      |
|         |        - schedule_callback()                                        |
|         |        - escalate_to_human()                                        |
|         |                                                                     |
|         v                                                                     |
|  [ Text-to-Speech (Neural Indic Speech Engine) ]                              |
|         |                                                                     |
|         v                                                                     |
|  [ Telephony Output Audio to Customer ]                                       |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                       STORAGE, AUDIT & ANALYTICS PIPELINE                     |
|  [ Call Record & Turn Transcript ] ---> [ PostgreSQL Database ]               |
|  [ Latency & Word Error Rate (WER) ] ---> [ Live Analytics Dashboard ]        |
+-------------------------------------------------------------------------------+
```

## Key Modules & Responsibilities

1. **Customer Ingestion**:
   - Parses CSV datasets containing name, phone, email, preferred language, call time, and notes.
   - Validates E.164 phone formats and initializes customer states.

2. **Campaign Management**:
   - Encapsulates domain goals (Appointment Reminders, Lead Qualification, Customer Satisfaction).
   - Configures calling windows (e.g., 09:00 - 19:00), languages, retry limits, and script goals.

3. **Multilingual Speech & NLP**:
   - Native recognition and response generation in Hindi, Marathi, English, and Hinglish.
   - Dynamic code-switching preservation so Marathi speakers receive Marathi replies and Hinglish inquiries receive conversational Hinglish.

4. **Dialogue Manager (FSM)**:
   - Prevents unconstrained LLM hallucinations through a strict State Machine.
   - Dispatches only controlled, auditable actions to backend services.

5. **RAG Pipeline**:
   - Indexed knowledge chunks for clinic timings, product plans, doctor availability, and cancellation rules.
   - Answers factual questions with cited reference grounds.

6. **Safety & Escalation Protocol**:
   - Detects customer frustration or explicit human agent requests.
   - Immediately transfers call to supervisor pool or generates high-priority 15-minute SLA tickets.
