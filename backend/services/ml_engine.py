import re
from typing import Dict, Any

def analyze_text_ml(text: str) -> Dict[str, Any]:
    """
    Since we are not requiring standard ML model training right now,
    we'll use a robust heuristic rule-based approach to generate initial scores
    which Claude will later consume and refine.
    """
    if not text:
        return _fallback_scores()
        
    text_length = len(text)
    exclamation_count = text.count("!")
    question_count = text.count("?")
    caps_count = sum(1 for c in text if c.isupper())
    caps_ratio = caps_count / text_length if text_length > 0 else 0
    
    # Basic emotional words heuristic
    emotional_words = ["shocking", "outrageous", "destroy", "miracle", "secret", "truth", "ban", "illegal", "hoax", "scam"]
    emotional_words_count = sum(1 for word in emotional_words if word in text.lower())
    
    # Source detection heuristic
    has_sources = bool(re.search(r'(according to|reported by|stated|study by|researchers from)', text, re.IGNORECASE))
    
    # Calculate heuristic score
    # Lower score = MORE LIKELY FAKE
    # Higher score = MORE LIKELY REAL
    ml_score = 75.0 # baseline
    
    if caps_ratio > 0.1:
        ml_score -= 15.0
    if exclamation_count > 3:
        ml_score -= 10.0
    if emotional_words_count > 2:
        ml_score -= 20.0
    if not has_sources:
        ml_score -= 15.0
    else:
        ml_score += 10.0
        
    # Bound between 0 and 100
    ml_score = max(0.0, min(100.0, ml_score))
    
    label = "FAKE" if ml_score < 50 else "REAL"
    if 40 <= ml_score <= 60:
        label = "UNCERTAIN"
        
    return {
        "label": label,
        "confidence": round(abs(ml_score - 50) * 2, 2) if label != "UNCERTAIN" else 50.0, # 0-100 scale mapping from 50
        "ml_score": round(ml_score, 2),
        "metrics": {
            "caps_ratio": round(caps_ratio, 2),
            "emotional_words_count": emotional_words_count,
            "has_sources": has_sources
        }
    }

def _fallback_scores() -> Dict[str, Any]:
    return {
        "label": "UNCERTAIN",
        "confidence": 0.0,
        "ml_score": 50.0,
        "metrics": {
            "caps_ratio": 0.0,
            "emotional_words_count": 0,
            "has_sources": False
        }
    }
