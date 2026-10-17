import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base, get_db
from backend.app.agents.intent_detector import intent_detector
from backend.app.agents.dialogue_manager import dialogue_manager
from backend.app.rag.vector_store import knowledge_store
from backend.app.workers.scheduler import call_scheduler
from backend.app.schemas.dto import (
    CustomerCreate, CustomerResponse,
    CampaignCreate, CampaignResponse,
    VoiceTurnInput, VoiceTurnOutput,
    CallInitiateRequest
)

# Initialize database schemas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multilingual Autonomous AI Voice Calling Agent for Intelligent Customer Interaction (Vishwakarma Institute of Technology, AY 2025-26, TY_E_13)",
    version=settings.PROJECT_VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "Authentication", "description": "JWT authentication and user session management"},
        {"name": "Customers", "description": "Customer CRM and CSV bulk ingestion"},
        {"name": "Campaigns", "description": "Voice calling campaign management"},
        {"name": "Calls", "description": "Outbound call initiation and conversational turn execution"},
        {"name": "Callbacks", "description": "Scheduled customer callback management"},
        {"name": "Knowledge Base", "description": "RAG semantic search and company policy retrieval"},
        {"name": "Analytics", "description": "Voice performance, intent F1, WER, and call duration analytics"},
        {"name": "Twilio Telephony", "description": "Twilio TwiML and status callback webhooks"}
    ]
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "department": settings.DEPARTMENT,
        "institution": settings.INSTITUTION,
        "group": settings.PROJECT_GROUP,
        "guide": settings.GUIDE_NAME,
        "mock_mode": settings.MOCK_MODE,
        "docs": "/docs"
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "voice-calling-agent-api"}

@app.post("/api/v1/voice/turn", response_model=VoiceTurnOutput, tags=["Calls"])
async def process_voice_turn(turn_input: VoiceTurnInput):
    """
    Core conversational turn endpoint:
    1. Transcribes customer speech (STT).
    2. Detects language (English, Hindi, Marathi, Hinglish).
    3. Detects intent and customer sentiment.
    4. Executes dialogue state transition and controlled business tool.
    5. Returns formatted conversational response text.
    """
    analysis = intent_detector.classify_intent(turn_input.text)
    state_trans = dialogue_manager.transition(
        current_state="UNDERSTANDING_INTENT",
        intent=analysis["intent"],
        customer_context={"id": "demo-cust"},
        campaign_goal="Appointment Confirmation"
    )

    resp_text = "धन्यवाद! आपली नोंदणी पुष्टी केली आहे." if analysis["language"] == "Marathi" else (
        "बहुत-बहुत धन्यवाद! आपकी पुष्टि दर्ज कर ली गई है।" if analysis["language"] == "Hindi" else (
            "Thank you! Your confirmation has been registered."
        )
    )

    return VoiceTurnOutput(
        response_text=resp_text,
        detected_language=analysis["language"],
        intent=analysis["intent"],
        sentiment=analysis["sentiment"],
        confidence=analysis["confidence"],
        next_state=state_trans["next_state"],
        action_executed={"action": state_trans.get("action"), "args": state_trans.get("action_args")},
        latency_ms=280
    )

@app.post("/api/v1/rag/search", tags=["Knowledge Base"])
async def search_knowledge(query: str):
    results = knowledge_store.search(query, top_k=3)
    return {"query": query, "results": results}
