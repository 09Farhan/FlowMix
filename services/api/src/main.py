from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="FlowMix API",
    description="Intelligent music transition platform API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from src.api import auth, mix

app.include_router(auth.router)
app.include_router(mix.router)

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}

