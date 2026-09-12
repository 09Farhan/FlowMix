from fastapi import FastAPI

app = FastAPI(
    title="FlowMix API",
    description="Intelligent music transition platform API",
    version="0.1.0",
)

from src.api import auth

app.include_router(auth.router)

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

