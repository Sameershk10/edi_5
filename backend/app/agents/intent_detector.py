from typing import Dict, Any, Tuple
import re

SUPPORTED_INTENTS = [
    "INTERESTED",
    "NOT_INTERESTED",
    "REQUEST_CALLBACK",
    "ASK_INFORMATION",
    "APPOINTMENT_REQUEST",
    "REGISTRATION",
    "SURVEY_RESPONSE",
    "CONFIRMATION",
    "CANCELLATION",
    "WRONG_NUMBER",
    "HUMAN_ESCALATION",
    "GOODBYE",
    "UNKNOWN"
]

class IntentDetector:
    """
    Multilingual Intent Classifier supporting English, Hindi, Marathi, and Hinglish.
    Combines rule-based phonetic patterns and semantic heuristics with LLM integration.
    """

    def detect_language(self, text: str) -> Tuple[str, float]:
        text_lower = text.lower()
        
        # Marathi heuristics (Devanagari & Latin transliterations)
        marathi_keywords = ["आहे", "नाही", "होय", "कसे", "मला", "उद्या", "सकाळी", "फोन", "करा", "सांगा", "वेळ", "नमस्कार"]
        marathi_latin = ["mala", "udya", "sakali", "sandhyakali", "bolaycha", "ahe", "nakkich", "kiti", "shakaal"]
        if any(w in text for w in marathi_keywords) or any(w in text_lower for w in marathi_latin):
            return "Marathi", 0.95

        # Hindi heuristics (Devanagari)
        hindi_keywords = ["है", "हूँ", "हाँ", "नहीं", "कल", "शाम", "बताइए", "कीजिए", "नमस्ते", "बात"]
        if any(w in text for w in hindi_keywords):
            return "Hindi", 0.94

        # Hinglish heuristics (Code-switching)
        hinglish_keywords = ["haan", "nahi", "kal", "shaam", "karna", "karo", "bataiye", "kya", "hai", "mera", "aap", "busy", "kar do", "theek"]
        if any(w in text_lower for w in hinglish_keywords):
            return "Hinglish", 0.92

        return "English", 0.88

    def classify_intent(self, text: str) -> Dict[str, Any]:
        text_clean = text.lower().strip()
        lang, lang_conf = self.detect_language(text)

        # Escalation Detection
        if any(k in text_clean for k in ["human", "manager", "officer", "executive", "person se", "manushya", "cheat", "scam", "frustrated"]):
            return {
                "intent": "HUMAN_ESCALATION",
                "confidence": 0.98,
                "language": lang,
                "sentiment": "negative"
            }

        # Callback Request
        if any(k in text_clean for k in ["callback", "busy", "kal", "later", "shaam", "sakali", "nantar", "phone kara", "bad mein", "call me back"]):
            return {
                "intent": "REQUEST_CALLBACK",
                "confidence": 0.95,
                "language": lang,
                "sentiment": "neutral"
            }

        # Confirmation
        if any(k in text_clean for k in ["haan", "confirm", "yes", "ho", "theek", "sure", "kar do", "yein", "done", "alright"]):
            return {
                "intent": "CONFIRMATION",
                "confidence": 0.96,
                "language": lang,
                "sentiment": "positive"
            }

        # Not Interested
        if any(k in text_clean for k in ["nahi", "not interested", "cancel", "nakos", "band karo", "no thanks", "don't call"]):
            return {
                "intent": "NOT_INTERESTED",
                "confidence": 0.95,
                "language": lang,
                "sentiment": "negative"
            }

        # Question / Information
        if any(k in text_clean for k in ["kya", "why", "how", "what", "timing", "price", "doctor", "kiti", "kuthe", "where", "fees"]):
            return {
                "intent": "ASK_INFORMATION",
                "confidence": 0.90,
                "language": lang,
                "sentiment": "neutral"
            }

        # Goodbye
        if any(k in text_clean for k in ["bye", "goodbye", "dhanyawad", "thank you", "alvida"]):
            return {
                "intent": "GOODBYE",
                "confidence": 0.93,
                "language": lang,
                "sentiment": "positive"
            }

        return {
            "intent": "UNKNOWN",
            "confidence": 0.65,
            "language": lang,
            "sentiment": "neutral"
        }

intent_detector = IntentDetector()
