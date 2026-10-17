from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=True)
    status = Column(String, default="draft", index=True) # draft, active, paused, completed
    start_time = Column(String, default="09:00")
    end_time = Column(String, default="18:00")
    max_attempts = Column(Integer, default=3)
    language = Column(String, default="Multilingual")
    objective = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customers = relationship("Customer", back_populates="campaign")
    calls = relationship("Call", back_populates="campaign")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    phone_number = Column(String, nullable=False, index=True)
    email = Column(String, nullable=True)
    preferred_language = Column(String, default="English", index=True) # English, Hindi, Marathi, Hinglish
    preferred_call_time = Column(String, default="12:00")
    status = Column(String, default="pending", index=True) # pending, calling, completed, callback_scheduled, escalated, failed
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=True)
    last_call_at = Column(DateTime, nullable=True)
    next_callback_at = Column(DateTime, nullable=True)
    call_attempts = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    campaign = relationship("Campaign", back_populates="customers")
    calls = relationship("Call", back_populates="customer")
    callbacks = relationship("Callback", back_populates="customer")

class Call(Base):
    __tablename__ = "calls"

    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False, index=True)
    campaign_id = Column(String, ForeignKey("campaigns.id"), nullable=False, index=True)
    twilio_call_sid = Column(String, nullable=True, index=True)
    status = Column(String, default="queued") # queued, ringing, in_progress, completed, failed
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    duration = Column(Integer, default=0)
    detected_language = Column(String, default="English")
    final_intent = Column(String, nullable=True)
    sentiment = Column(String, default="neutral")
    outcome = Column(String, default="in_progress")
    escalated = Column(Boolean, default=False)
    transcript = Column(Text, default="[]") # JSON stringified
    recording_url = Column(String, nullable=True)
    dialogue_state = Column(String, default="INITIAL")
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="calls")
    campaign = relationship("Campaign", back_populates="calls")
    callbacks = relationship("Callback", back_populates="call")

class Callback(Base):
    __tablename__ = "callbacks"

    id = Column(String, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.id"), nullable=False, index=True)
    call_id = Column(String, ForeignKey("calls.id"), nullable=True)
    scheduled_at = Column(DateTime, nullable=False, index=True)
    reason = Column(Text, nullable=True)
    status = Column(String, default="scheduled", index=True) # scheduled, completed, cancelled, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    customer = relationship("Customer", back_populates="callbacks")
    call = relationship("Call", back_populates="callbacks")

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, default="General")
    content = Column(Text, nullable=False)
    chunks = Column(Text, default="[]") # JSON stringified
    tags = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
