import asyncio
import traceback
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers.rsvp import router as rsvp_router
from services.telegram import dispatch_telegram_alert

load_dotenv()

app = FastAPI(
    title="Melissa & Levi Wedding API",
    description="RSVP API for wedding website",
    version="1.0.0"
)

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Error telemetry middleware (500 errors)
@app.middleware("http")
async def error_telemetry_middleware(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as error:
        stack_trace = traceback.format_exc()
        alert_body = f"🚨 ERRO 500\nRota: {request.url.path}\nErro: {str(error)}\n\nStack:\n{stack_trace[:500]}"
        asyncio.create_task(dispatch_telegram_alert(alert_body))
        raise error

# Routes
app.include_router(rsvp_router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
