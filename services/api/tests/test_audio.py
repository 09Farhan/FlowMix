import pytest
from httpx import AsyncClient, ASGITransport
from src.main import app

@pytest.mark.asyncio
async def test_generate_transition_close_bpm():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/v1/mix/generate", json={"track1_bpm": 120.0, "track2_bpm": 122.0})
    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert response.json()["data"]["type"] == "long_crossfade"

@pytest.mark.asyncio
async def test_generate_transition_moderate_bpm():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/v1/mix/generate", json={"track1_bpm": 120.0, "track2_bpm": 125.0})
    assert response.status_code == 200
    assert response.json()["data"]["type"] == "beatmatch_crossfade"
    
@pytest.mark.asyncio
async def test_generate_transition_large_bpm():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/v1/mix/generate", json={"track1_bpm": 120.0, "track2_bpm": 150.0})
    assert response.status_code == 200
    assert response.json()["data"]["type"] == "echo_out_drop"
