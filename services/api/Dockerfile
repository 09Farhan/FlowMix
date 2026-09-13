FROM python:3.12-slim

WORKDIR /app

# Install system dependencies required for librosa and audio processing
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY pyproject.toml README.md ./
COPY src/ ./src/

# We install the package using pip directly since hatchling is standard PEP-517
RUN pip install --no-cache-dir hatchling
RUN pip install --no-cache-dir -e .

EXPOSE 8000

# Start the FastAPI application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
