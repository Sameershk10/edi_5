import pytest
from backend.app.agents.intent_detector import intent_detector

def test_language_detection_hindi():
    lang, conf = intent_detector.detect_language("हाँ, मैं कल शाम 5 बजे आ सकता हूँ।")
    assert lang == "Hindi"
    assert conf >= 0.90

def test_language_detection_marathi():
    lang, conf = intent_detector.detect_language("मला उद्या सकाळी फोन करा.")
    assert lang == "Marathi"
    assert conf >= 0.90

def test_language_detection_hinglish():
    lang, conf = intent_detector.detect_language("Abhi busy hoon, kal shaam call karna.")
    assert lang in ["Hinglish", "Hindi"]
    assert conf >= 0.85

def test_intent_callback_request():
    result = intent_detector.classify_intent("Please call me back tomorrow evening, I am busy right now.")
    assert result["intent"] == "REQUEST_CALLBACK"
    assert result["sentiment"] == "neutral"

def test_intent_confirmation():
    result = intent_detector.classify_intent("Haan confirm kar do.")
    assert result["intent"] == "CONFIRMATION"
    assert result["sentiment"] == "positive"

def test_intent_human_escalation():
    result = intent_detector.classify_intent("Connect me to a human manager immediately!")
    assert result["intent"] == "HUMAN_ESCALATION"
    assert result["sentiment"] == "negative"

def test_intent_not_interested():
    result = intent_detector.classify_intent("I am not interested, please cancel my number.")
    assert result["intent"] == "NOT_INTERESTED"
    assert result["sentiment"] == "negative"
