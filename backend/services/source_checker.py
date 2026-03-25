import json
import os
import tldextract
import whois
from datetime import datetime
from models.response_models import SourceCredibility

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KNOWN_FAKE_SITES_PATH = os.path.join(BASE_DIR, "data", "known_fake_sites.json")
TRUSTED_SOURCES_PATH = os.path.join(BASE_DIR, "data", "trusted_sources.json")

def load_json(filepath):
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except:
        return []

KNOWN_FAKE_SITES = load_json(KNOWN_FAKE_SITES_PATH)
TRUSTED_SOURCES = load_json(TRUSTED_SOURCES_PATH)

def check_source(url: str) -> SourceCredibility:
    if not url:
        return _default_unknown_source()
        
    extracted = tldextract.extract(url)
    domain_name = f"{extracted.domain}.{extracted.suffix}".lower()
    
    is_fake = domain_name in KNOWN_FAKE_SITES
    is_trusted = domain_name in TRUSTED_SOURCES
    
    # Basic Checks
    has_https = url.startswith("https://")
    
    # Mocking whois for speed, in production: 
    # Try fetching whois creation date. If fails, default 1.0.
    domain_age_years = 5.0 if is_trusted else (0.5 if is_fake else 2.0)
    
    if is_fake:
        rating = 1.0
        bias = "extreme"
        verdict = "Known Misinformation Source"
    elif is_trusted:
        rating = 5.0
        bias = "minimal"
        verdict = "Highly Credible"
    else:
        rating = 3.0
        bias = "unknown"
        verdict = "Questionable / Unverified"
        
    return SourceCredibility(
        domain=domain_name,
        credibility_rating=rating,
        is_known_fake_site=is_fake,
        domain_age_years=domain_age_years,
        has_https=has_https,
        bias_rating=bias,
        verdict=verdict
    )

def _default_unknown_source() -> SourceCredibility:
    return SourceCredibility(
        domain="Unknown",
        credibility_rating=2.5,
        is_known_fake_site=False,
        domain_age_years=0.0,
        has_https=False,
        bias_rating="unknown",
        verdict="No Source Provided"
    )
