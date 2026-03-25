from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class TextAnalysisRequest(BaseModel):
    text: str
    input_type: str = "article"

class URLAnalysisRequest(BaseModel):
    url: str

class HeadlineAnalysisRequest(BaseModel):
    headline: str

class SocialAnalysisRequest(BaseModel):
    post_text: str
    platform: str

class ChatMessage(BaseModel):
    role: str
    content: str
    
class ChatRequest(BaseModel):
    message: str
    article_context: str
    analysis_results: Dict[str, Any]
    chat_history: List[ChatMessage] = []
