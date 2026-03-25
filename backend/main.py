from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, chat
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from utils.rate_limiter import limiter

app = FastAPI(title="TruthLens API", description="Fake News Detection System API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router)
app.include_router(chat.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
