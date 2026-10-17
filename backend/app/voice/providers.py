from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class STTProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_data: bytes, language_hint: Optional[str] = None) -> Dict[str, Any]:
        """Returns dict containing text, language, confidence, duration."""
        pass

class MockSTTProvider(STTProvider):
    async def transcribe(self, audio_data: bytes, language_hint: Optional[str] = "Hindi") -> Dict[str, Any]:
        return {
            "text": "हाँ, मैं कल शाम 5 बजे आ सकता हूँ।",
            "language": language_hint or "Hindi",
            "confidence": 0.96,
            "duration": 2.4
        }

class TTSProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str, language: str = "English", voice: Optional[str] = None) -> bytes:
        """Returns raw or encoded audio bytes."""
        pass

class MockTTSProvider(TTSProvider):
    async def synthesize(self, text: str, language: str = "English", voice: Optional[str] = None) -> bytes:
        # Return lightweight placeholder header
        return b"RIFFmockwavheader0000WAVEfmt"

class TelephonyProvider(ABC):
    @abstractmethod
    async def initiate_call(self, to_phone: str, from_phone: str, webhook_url: str) -> Dict[str, Any]:
        pass

class MockTwilioClient(TelephonyProvider):
    async def initiate_call(self, to_phone: str, from_phone: str, webhook_url: str) -> Dict[str, Any]:
        return {
            "sid": f"CA_mock_{hash(to_phone)}",
            "status": "queued",
            "to": to_phone,
            "from": from_phone,
            "mock": True
        }
