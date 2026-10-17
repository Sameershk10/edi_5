from typing import List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Customer Schemas
class CustomerBase(BaseModel):
    name: str = Field(..., example="Rahul Sharma")
    phone_number: str = Field(..., example="+919876543210")
    email: Optional[str] = Field(None, example="rahul@example.com")
    preferred_language: str = Field("English", example="Hindi")
    preferred_call_time: str = Field("12:00", example="17:00")
    notes: Optional[str] = None
    campaign_id: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    preferred_language: Optional[str] = None
    preferred_call_time: Optional[str] = None
    status: Optional[str] = None
    campaign_id: Optional[str] = None
    notes: Optional[str] = None
    next_callback_at: Optional[datetime] = None

class CustomerResponse(CustomerBase):
    id: str
    status: str
    call_attempts: int
    last_call_at: Optional[datetime] = None
    next_callback_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Campaign Schemas
class CampaignBase(BaseModel):
    name: str = Field(..., example="Appointment Reminder")
    description: Optional[str] = None
    start_time: str = "09:00"
    end_time: str = "18:00"
    max_attempts: int = 3
    language: str = "Multilingual"
    objective: Optional[str] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    max_attempts: Optional[int] = None
    language: Optional[str] = None
    objective: Optional[str] = None

class CampaignResponse(CampaignBase):
    id: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Call & Voice Turn Schemas
class TranscriptItem(BaseModel):
    speaker: str # agent, customer, system
    text: str
    timestamp: str
    intent: Optional[str] = None
    confidence: Optional[float] = None
    language: Optional[str] = None
    sentiment: Optional[str] = None

class VoiceTurnInput(BaseModel):
    text: str = Field(..., example="Haan confirm kar do")
    audio_base64: Optional[str] = None

class VoiceTurnOutput(BaseModel):
    response_text: str
    detected_language: str
    intent: str
    sentiment: str
    confidence: float
    next_state: str
    action_executed: Optional[dict] = None
    latency_ms: int

class CallInitiateRequest(BaseModel):
    customer_id: str
    campaign_id: Optional[str] = None

class CallResponse(BaseModel):
    id: str
    customer_id: str
    campaign_id: str
    twilio_call_sid: Optional[str] = None
    status: str
    started_at: datetime
    ended_at: Optional[datetime] = None
    duration: int
    detected_language: str
    final_intent: Optional[str] = None
    sentiment: Optional[str] = None
    outcome: str
    escalated: bool
    dialogue_state: str
    latency_ms: int

    class Config:
        from_attributes = True

# Callback Schemas
class CallbackCreate(BaseModel):
    customer_id: str
    call_id: Optional[str] = None
    scheduled_at: datetime
    reason: Optional[str] = None

class CallbackResponse(BaseModel):
    id: str
    customer_id: str
    call_id: Optional[str] = None
    scheduled_at: datetime
    reason: Optional[str] = None
    status: str
    created_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
