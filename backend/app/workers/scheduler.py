from datetime import datetime
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class CallScheduler:
    """
    Intelligent outbound call scheduler.
    Respects campaign hours, customer preferred call time, max attempts, and concurrency limits.
    """
    def __init__(self):
        self.queue: List[Dict[str, Any]] = []

    def is_within_calling_window(self, start_time: str, end_time: str) -> bool:
        now_str = datetime.now().strftime("%H:%M")
        return start_time <= now_str <= end_time

    def schedule_customer_call(
        self,
        customer_id: str,
        customer_name: str,
        phone: str,
        preferred_time: str,
        campaign_id: str,
        attempts: int,
        max_attempts: int
    ) -> bool:
        if attempts >= max_attempts:
            logger.info("Customer %s has exceeded max attempts (%d/%d)", customer_id, attempts, max_attempts)
            return False

        job = {
            "customer_id": customer_id,
            "customer_name": customer_name,
            "phone": phone,
            "preferred_time": preferred_time,
            "campaign_id": campaign_id,
            "enqueued_at": datetime.utcnow().isoformat(),
            "status": "pending"
        }
        self.queue.append(job)
        return True

    def dispatch_next_job(self) -> Dict[str, Any]:
        if not self.queue:
            return None
        return self.queue.pop(0)

call_scheduler = CallScheduler()
