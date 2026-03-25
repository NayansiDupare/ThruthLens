from fastapi import APIRouter, UploadFile, File, Form, Request
from fastapi.responses import StreamingResponse, Response
from models.request_models import TextAnalysisRequest, URLAnalysisRequest, HeadlineAnalysisRequest, SocialAnalysisRequest
from models.response_models import FullAnalysisResponse
from services.content_extractor import extract_from_url, extract_from_image
from services.ml_engine import analyze_text_ml
from services.source_checker import check_source
from services.claude_service import get_claude_analysis
from services.report_generator import generate_pdf_report
import json
import asyncio
import hashlib
from utils.rate_limiter import limiter

# In-memory cache to store API responses and save Claude API costs
analysis_cache = {}

def get_cache_key(text: str, url: str) -> str:
    key_str = f"{text}_{url}"
    return hashlib.md5(key_str.encode()).hexdigest()

router = APIRouter()

async def run_full_analysis_stream(text: str, source_url: str = None):
    cache_key = get_cache_key(text, source_url)
    if cache_key in analysis_cache:
        yield f"data: {json.dumps({'status': 'extracting', 'message': 'Loading from cache'})}\n\n"
        await asyncio.sleep(0.1)
        yield f"data: {json.dumps({'status': 'complete', 'message': 'Cache Hit', 'result': analysis_cache[cache_key]})}\n\n"
        return

    # Yield Extracting content
    yield f"data: {json.dumps({'status': 'extracting', 'message': 'Extracting content'})}\n\n"
    await asyncio.sleep(0.5)
    
    # 1. Run ML Model
    yield f"data: {json.dumps({'status': 'ml', 'message': 'Running ML models'})}\n\n"
    ml_result = analyze_text_ml(text)
    
    # 2. Check Source
    yield f"data: {json.dumps({'status': 'source', 'message': 'Checking source credibility'})}\n\n"
    source_result = check_source(source_url) if source_url else check_source(None)
    
    # 3. Get Claude Analysis
    yield f"data: {json.dumps({'status': 'ai', 'message': 'AI analysis'})}\n\n"
    claude_result = await get_claude_analysis(text, ml_result, source_result)
    
    # Return aggregated result
    final_dict = claude_result.model_dump()
    analysis_cache[cache_key] = final_dict
    yield f"data: {json.dumps({'status': 'complete', 'message': 'Generating report', 'result': final_dict})}\n\n"

@router.post("/api/analyze/text")
@limiter.limit("5/minute")
async def analyze_text(request: Request, payload: TextAnalysisRequest):
    return StreamingResponse(run_full_analysis_stream(payload.text), media_type="text/event-stream")

@router.post("/api/analyze/url")
@limiter.limit("5/minute")
async def analyze_url(request: Request, payload: URLAnalysisRequest):
    extracted = extract_from_url(payload.url)
    return StreamingResponse(run_full_analysis_stream(extracted["text"], source_url=payload.url), media_type="text/event-stream")

@router.post("/api/analyze/headline")
@limiter.limit("10/minute")
async def analyze_headline(request: Request, payload: HeadlineAnalysisRequest):
    return StreamingResponse(run_full_analysis_stream(payload.headline), media_type="text/event-stream")

@router.post("/api/analyze/social")
@limiter.limit("10/minute")
async def analyze_social(request: Request, payload: SocialAnalysisRequest):
    return StreamingResponse(run_full_analysis_stream(f"Platform: {payload.platform}\n\n{payload.post_text}"), media_type="text/event-stream")

@router.post("/api/analyze/image")
@limiter.limit("5/minute")
async def analyze_image(request: Request, file: UploadFile = File(...)):
    extracted = extract_from_image(file)
    # Fast-forward extracted text inject manually via a wrapper generator
    async def inject_extracted_text_stream():
        async for chunk in run_full_analysis_stream(extracted["extracted_text"]):
            if '"status": "complete"' in chunk:
                # parse and inject extracted text
                data_str = chunk.replace("data: ", "", 1).strip()
                data = json.loads(data_str)
                data["result"]["extracted_text"] = extracted["extracted_text"]
                yield f"data: {json.dumps(data)}\n\n"
            else:
                yield chunk
    return StreamingResponse(inject_extracted_text_stream(), media_type="text/event-stream")

@router.post("/api/report/pdf")
@limiter.limit("10/minute")
async def generate_report_pdf(request: Request, payload: FullAnalysisResponse):
    pdf_bytes = generate_pdf_report(payload)
    return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=truthlens_report.pdf"})
