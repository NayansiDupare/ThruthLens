from pydantic import BaseModel
from typing import List, Optional

class SourceCredibility(BaseModel):
    domain: str
    credibility_rating: float
    is_known_fake_site: bool
    domain_age_years: float
    has_https: bool
    bias_rating: str
    verdict: str

class ContentAnalysis(BaseModel):
    emotional_language_score: int
    clickbait_score: int
    writing_quality_score: int
    factual_claim_density: int
    has_citations: bool
    has_statistics: bool

class SimilarVerifiedNews(BaseModel):
    headline: str
    source: str
    url: str
    date: str
    is_verified: bool

class FullAnalysisResponse(BaseModel):
    verdict: str
    confidence_score: float
    ml_score: float
    ai_score: float
    source_score: float
    ai_explanation: str
    red_flags: List[str]
    source_credibility: SourceCredibility
    content_analysis: ContentAnalysis
    similar_verified_news: List[SimilarVerifiedNews]
    recommendation: str
    detailed_report: str
    
class ChatResponse(BaseModel):
    reply: str
