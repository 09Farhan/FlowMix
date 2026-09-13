from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import Any
from pydantic import BaseModel

from ..services.audio import analyze_audio, calculate_transition_parameters

router = APIRouter(prefix="/v1/mix", tags=["Transition Engine"])

class TransitionRequest(BaseModel):
    track1_bpm: float
    track2_bpm: float

@router.post("/analyze")
async def analyze_track(file: UploadFile = File(...)) -> Any:
    """
    Analyzes an uploaded audio file and returns its BPM and Key.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")
        
    # We only accept WAV files for the MVP to avoid needing FFmpeg locally
    if not file.filename.lower().endswith('.wav'):
        raise HTTPException(
            status_code=400, 
            detail="For MVP local testing, please upload .wav files (FFmpeg not guaranteed to be installed for mp3 support)"
        )

    try:
        file_bytes = await file.read()
        result = await analyze_audio(file_bytes, file.filename)
        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio analysis failed: {str(e)}")

@router.post("/generate")
async def generate_transition(request: TransitionRequest) -> Any:
    """
    Calculates transition parameters based on the BPMs of two tracks.
    """
    try:
        parameters = calculate_transition_parameters(request.track1_bpm, request.track2_bpm)
        return {"status": "success", "data": parameters}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transition generation failed: {str(e)}")
