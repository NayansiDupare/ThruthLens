from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from models.request_models import ChatRequest
from models.response_models import ChatResponse
from services.claude_service import chat_with_claude, chat_with_claude_stream
import json

router = APIRouter()

@router.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    reply = await chat_with_claude(
        message=request.message,
        article_context=request.article_context,
        analysis_results=request.analysis_results,
        chat_history=request.chat_history
    )
    return ChatResponse(reply=reply)

@router.websocket("/api/chat/ws")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            request_data = json.loads(data)
            
            message = request_data.get("message", "")
            article_context = request_data.get("article_context", "")
            analysis_results = request_data.get("analysis_results", {})
            chat_history = request_data.get("chat_history", [])
            
            async for chunk in chat_with_claude_stream(message, article_context, analysis_results, chat_history):
                await websocket.send_text(chunk)
                
            await websocket.send_text("[DONE]")
            
    except WebSocketDisconnect:
        print("Client disconnected from chat websocket")
    except Exception as e:
        await websocket.send_text(f"Error: {str(e)}")
        await websocket.send_text("[DONE]")
