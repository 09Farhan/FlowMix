import librosa
import numpy as np
import io
import soundfile as sf

async def analyze_audio(file_bytes: bytes, filename: str) -> dict:
    """
    Analyzes an audio file for BPM and musical key using librosa.
    For MVP, this supports WAV files natively.
    """
    # Load audio data from bytes
    y, sr = sf.read(io.BytesIO(file_bytes))
    
    # Ensure it's mono for librosa processing
    if len(y.shape) > 1:
        y = np.mean(y, axis=1)

    # 1. Calculate BPM (Tempo)
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    
    # Handle the fact that tempo might be a 1D array depending on librosa version
    if isinstance(tempo, np.ndarray):
        bpm = float(tempo[0])
    else:
        bpm = float(tempo)
        
    # 2. Calculate Key (Simplified MVP Implementation)
    # Extract chroma features (Constant-Q Transform is good for musical pitch)
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    
    # Sum the chroma features over time to find the dominant pitch class
    chroma_vals = np.sum(chroma, axis=1)
    
    # Define pitch classes
    pitch_classes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    # Get the most prominent pitch class
    key_idx = np.argmax(chroma_vals)
    key = pitch_classes[key_idx]

    # For a more advanced implementation, we would use Krumhansl-Schmuckler 
    # to determine Major vs Minor, but this basic root detection works for the MVP.

    return {
        "bpm": round(bpm, 2),
        "key": key,
        "filename": filename,
        "duration_seconds": round(len(y) / sr, 2)
    }

def calculate_transition_parameters(track1_bpm: float, track2_bpm: float) -> dict:
    """
    Determines transition parameters based on the BPM difference.
    """
    bpm_diff = abs(track1_bpm - track2_bpm)
    
    if bpm_diff < 3:
        # Very close BPMs: Long smooth crossfade
        return {
            "type": "long_crossfade",
            "duration": 16.0, # seconds
            "pitch_shift": False,
            "description": "BPMs match closely. Applying a smooth 16-second crossfade."
        }
    elif bpm_diff < 10:
        # Moderate difference: Beat-matched shorter crossfade
        return {
            "type": "beatmatch_crossfade",
            "duration": 8.0,
            "pitch_shift": True,
            "description": "Moderate BPM difference. Pitching track 2 to match track 1 for an 8-second mix."
        }
    else:
        # Large difference: Drop mix or echo out
        return {
            "type": "echo_out_drop",
            "duration": 2.0,
            "pitch_shift": False,
            "description": "Large BPM gap. Echoing out track 1 and dropping track 2 on the one."
        }
