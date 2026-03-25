import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
from models.response_models import FullAnalysisResponse, ContentAnalysis, SourceCredibility
from typing import List, Dict, Any

load_dotenv()

# Initialize the client.
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

async def get_claude_analysis(text: str, ml_result: Dict[str, Any], source_credibility: SourceCredibility) -> FullAnalysisResponse:
    if not client.api_key or client.api_key == "your_key_here":
        # Return mocked data if API key is not set to allow local UI development
        return _mock_claude_response(text, ml_result, source_credibility)
        
    system_prompt = """
    You are TruthLens AI, an expert fact-checker and misinformation analyst. 
    Analyze the provided news content and give a detailed assessment of its credibility. 
    Return your response in strictly valid JSON format matching this schema:
    {
      "verdict": "FAKE" | "REAL" | "UNCERTAIN",
      "confidence_score": float (0-100),
      "ml_score": float (0-100),
      "ai_score": float (0-100),
      "source_score": float (0-100),
      "ai_explanation": "Detailed explanation (EXTREMELY CONCISE, maximum 2 sentences)...",
      "red_flags": ["very short flag 1", "very short flag 2"],
      "content_analysis": {
         "emotional_language_score": int (0-100),
         "clickbait_score": int (0-100),
         "writing_quality_score": int (0-100),
         "factual_claim_density": int (0-100),
         "has_citations": bool,
         "has_statistics": bool
      },
      "similar_verified_news": [
         { "headline": "string", "source": "string", "url": "string", "date": "YYYY-MM-DD", "is_verified": bool }
      ],
      "recommendation": "DO NOT SHARE" | "VERIFY BEFORE SHARING" | "SAFE TO SHARE",
      "detailed_report": "extremely short markdown text (max 3 bullet points) to optimize speed"
    }

    CRITICAL: YOU MUST RESPOND AS FAST AS POSSIBLE. KEEP ALL STRINGS EXTREMELY SHORT. DO NOT HALLUCINATE LONG PARAGRAPHS.
    """
    
    prompt = f"Text to analyze:\n{text}\n\nExisting ML heuristic metrics: {json.dumps(ml_result)}\nSource Check: {json.dumps(source_credibility.model_dump())}"
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )
        # Parse JSON response
        response_text = response.choices[0].message.content
        # Safety net: Extract JSON block if claude returned markdown wrappers
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
            
        data = json.loads(response_text)
        
        # Merge with our source credibility result
        data["source_credibility"] = source_credibility.model_dump()
        return FullAnalysisResponse(**data)
        
    except Exception as e:
        print(f"Claude API Error: {e}")
        return _mock_claude_response(text, ml_result, source_credibility)

async def chat_with_claude(message: str, article_context: str, analysis_results: Dict[str, Any], chat_history: List[Any]) -> str:
    if not client.api_key or client.api_key == "your_key_here":
        return "Please set your OPENAI_API_KEY in the backend `.env` file to enable the chat feature."
        
    system_prompt = "You are TruthLens AI Assistant, a friendly and knowledgeable fact-checking chatbot. You have the full context of a news article and its analysis. Help the user understand why the content is fake or real."
    
    context_msg = f"Article Context:\n{article_context}\n\nAnalysis Results:\n{json.dumps(analysis_results)}"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": context_msg}
    ]
    for msg in chat_history:
        messages.append({"role": msg.role, "content": msg.content})
    messages.append({"role": "user", "content": message})
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.5
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error connecting to Claude: {str(e)}"

async def chat_with_claude_stream(message: str, article_context: str, analysis_results: Dict[str, Any], chat_history: List[Any]):
    if not client.api_key or client.api_key == "your_key_here":
        yield "Please set your OPENAI_API_KEY in the backend `.env` file to enable the chat feature."
        return
        
    system_prompt = "You are TruthLens AI Assistant, a friendly and knowledgeable fact-checking chatbot. You have the full context of a news article and its analysis. Help the user understand why the content is fake or real. Answer concisely."
    
    context_msg = f"Article Context:\n{article_context}\n\nAnalysis Results:\n{json.dumps(analysis_results)}"
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": context_msg}
    ]
    for msg in chat_history:
        role = msg.get("role", "user") if isinstance(msg, dict) else getattr(msg, "role", "user")
        content = msg.get("content", "") if isinstance(msg, dict) else getattr(msg, "content", "")
        # Filter out the initial greeting if it's there
        if content and role:
            messages.append({"role": role, "content": content})
            
    messages.append({"role": "user", "content": message})
    
    try:
        stream = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            temperature=0.5,
            stream=True
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content is not None:
                yield chunk.choices[0].delta.content
    except Exception as e:
        yield f"Error connecting to Claude: {str(e)}"

def _mock_claude_response(text: str, ml_result: Dict[str, Any], source_credibility: SourceCredibility) -> FullAnalysisResponse:
    ml_score = ml_result.get("ml_score", 50.0)
    verdict = "UNCERTAIN"
    if ml_score < 40:
        verdict = "FAKE"
    elif ml_score > 60:
        verdict = "REAL"
        
    fake = verdict == "FAKE"
    
    return FullAnalysisResponse(
        verdict=verdict,
        confidence_score=abs(ml_score - 50) * 2 if verdict != "UNCERTAIN" else 40.0,
        ml_score=ml_score,
        ai_score=ml_score - 5 if fake else ml_score + 5,
        source_score=source_credibility.credibility_rating * 20,
        ai_explanation="[MOCK response (Please add Anthropic API key)] The article uses highly emotional language and lacks citations from credible sources.",
        red_flags=["Highly emotional wording", "Missing credible sources"] if fake else ["No major red flags detected"],
        source_credibility=source_credibility,
        content_analysis=ContentAnalysis(
            emotional_language_score=85 if fake else 20,
            clickbait_score=75 if fake else 10,
            writing_quality_score=40 if fake else 85,
            factual_claim_density=30 if fake else 70,
            has_citations=not fake,
            has_statistics=not fake
        ),
        similar_verified_news=[{
            "headline": "Real verified version of this news from AP",
            "source": "AP News",
            "url": "https://apnews.com/",
            "date": "2025-03-21",
            "is_verified": True
        }],
        recommendation="DO NOT SHARE" if fake else "SAFE TO SHARE",
        detailed_report="# Detailed Analysis Report (Mocked)\n\nThis is a mocked report."
    )
