from fastapi import FastAPI

app = FastAPI(
    title="FlowMix API",
    description="Intelligent music transition platform API",
    version="0.1.0",
)

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
