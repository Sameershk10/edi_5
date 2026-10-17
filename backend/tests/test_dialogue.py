import pytest
from backend.app.agents.dialogue_manager import dialogue_manager
from backend.app.workers.scheduler import call_scheduler
from backend.app.rag.vector_store import knowledge_store

def test_dialogue_transition_to_escalation():
    transition = dialogue_manager.transition(
        current_state="UNDERSTANDING_INTENT",
        intent="HUMAN_ESCALATION",
        customer_context={"id": "cust-1"},
        campaign_goal="Follow-up"
    )
    assert transition["next_state"] == "ESCALATING"
    assert transition["action"] == "escalate_to_human"

def test_dialogue_transition_to_callback():
    transition = dialogue_manager.transition(
        current_state="UNDERSTANDING_INTENT",
        intent="REQUEST_CALLBACK",
        customer_context={"id": "cust-1"},
        campaign_goal="Appointment Confirmation"
    )
    assert transition["next_state"] == "SCHEDULING_CALLBACK"
    assert transition["action"] == "schedule_callback"

def test_call_scheduler_enqueue():
    success = call_scheduler.schedule_customer_call(
        customer_id="cust-101",
        customer_name="Rahul Sharma",
        phone="+919876543210",
        preferred_time="17:00",
        campaign_id="camp-1",
        attempts=1,
        max_attempts=3
    )
    assert success is True
    job = call_scheduler.dispatch_next_job()
    assert job is not None
    assert job["customer_name"] == "Rahul Sharma"

def test_call_scheduler_max_attempts_exceeded():
    success = call_scheduler.schedule_customer_call(
        customer_id="cust-102",
        customer_name="Exceeded User",
        phone="+919876543211",
        preferred_time="10:00",
        campaign_id="camp-1",
        attempts=3,
        max_attempts=3
    )
    assert success is False

def test_rag_retrieval():
    results = knowledge_store.search("clinic timings", top_k=2)
    assert len(results) > 0
    assert any("Monday" in r["chunk"] or "Clinic" in r["chunk"] for r in results)
