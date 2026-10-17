from typing import Dict, Any, Optional

class DialogueManager:
    """
    Finite-State Machine dialogue manager for conversational context & policy.
    Ensures safe, structured turns and dispatches controlled business actions.
    """

    STATES = [
        "INITIAL",
        "GREETING",
        "IDENTIFYING_CUSTOMER",
        "UNDERSTANDING_INTENT",
        "PROVIDING_INFORMATION",
        "ASKING_FOLLOWUP",
        "SCHEDULING_CALLBACK",
        "CONFIRMING_ACTION",
        "ESCALATING",
        "ENDING",
        "COMPLETED"
    ]

    def transition(
        self,
        current_state: str,
        intent: str,
        customer_context: Dict[str, Any],
        campaign_goal: str
    ) -> Dict[str, Any]:
        """
        Determines next state and candidate tool execution.
        """
        if intent == "HUMAN_ESCALATION":
            return {
                "next_state": "ESCALATING",
                "action": "escalate_to_human",
                "action_args": {"reason": "Customer requested human or expressed negative sentiment"},
                "should_end_call": False
            }

        if intent == "REQUEST_CALLBACK":
            return {
                "next_state": "SCHEDULING_CALLBACK",
                "action": "schedule_callback",
                "action_args": {"preferred_time": "Tomorrow 10:00 AM"},
                "should_end_call": True
            }

        if intent == "CONFIRMATION":
            return {
                "next_state": "COMPLETED",
                "action": "confirm_appointment",
                "action_args": {"customer_id": customer_context.get("id")},
                "should_end_call": True
            }

        if intent == "NOT_INTERESTED":
            return {
                "next_state": "COMPLETED",
                "action": "update_customer_status",
                "action_args": {"status": "not_interested"},
                "should_end_call": True
            }

        if intent == "ASK_INFORMATION":
            return {
                "next_state": "PROVIDING_INFORMATION",
                "action": "search_knowledge_base",
                "action_args": {},
                "should_end_call": False
            }

        # Default transition based on current state
        if current_state == "GREETING":
            return {
                "next_state": "UNDERSTANDING_INTENT",
                "action": None,
                "should_end_call": False
            }

        return {
            "next_state": "UNDERSTANDING_INTENT",
            "action": None,
            "should_end_call": False
        }

dialogue_manager = DialogueManager()
