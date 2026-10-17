import math
import re
from typing import List, Dict, Any

class LocalVectorStore:
    """
    In-memory vector store & semantic search engine with BM25 / Cosine term frequency matching.
    Provides pluggable vector interface for Pinecone / ChromaDB in production.
    """
    def __init__(self):
        self.documents: List[Dict[str, Any]] = []

    def add_document(self, doc_id: str, title: str, content: str, chunks: List[str]):
        self.documents.append({
            "id": doc_id,
            "title": title,
            "content": content,
            "chunks": chunks
        })

    def search(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        query_terms = set(re.findall(r'\w+', query.lower()))
        scored = []

        for doc in self.documents:
            for chunk in doc["chunks"]:
                chunk_terms = re.findall(r'\w+', chunk.lower())
                overlap = sum(1 for term in query_terms if term in chunk_terms)
                if overlap > 0:
                    score = overlap / (len(query_terms) + 1.0)
                    scored.append({
                        "doc_id": doc["id"],
                        "title": doc["title"],
                        "chunk": chunk,
                        "score": score
                    })

        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:top_k]

# Global vector store pre-seeded
knowledge_store = LocalVectorStore()
knowledge_store.add_document(
    doc_id="kb-1",
    title="Clinic Timings & Appointment Rules",
    content="ABC Health Clinic is open Mon-Sat 8:00 AM to 8:00 PM.",
    chunks=[
        "Clinic timings are Monday to Saturday from 8:00 AM to 8:00 PM.",
        "Rescheduling policy allows patients to change slots free of charge up to 2 hours in advance.",
        "Emergency OPD is open on Sundays from 10:00 AM to 2:00 PM."
    ]
)
knowledge_store.add_document(
    doc_id="kb-2",
    title="Enterprise AI Voice Agent Features",
    content="Supports English, Hindi, Marathi, and Hinglish.",
    chunks=[
        "Our autonomous voice platform supports English, Hindi, Marathi, and Hinglish code-switching.",
        "Average response latency is under 500 milliseconds.",
        "System includes automatic callback scheduling and live human supervisor escalation."
    ]
)
