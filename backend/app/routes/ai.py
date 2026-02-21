from fastapi import APIRouter, HTTPException
from app.schemas import AnalyzeRequest
import requests
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

@router.post("/analyze")
def analyze(request: AnalyzeRequest):

    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not found")

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": "You are a professional AI sales strategist."},
                    {"role": "user", "content": request.message},
                ],
            },
            timeout=30,
        )

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=response.text
            )

        result = response.json()

        if "choices" not in result:
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected Groq response: {result}"
            )

        return {
            "response": result["choices"][0]["message"]["content"]
        }

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/generate-email")
def generate_email(request: AnalyzeRequest):

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a B2B sales email expert. Generate a high-converting cold email."
                    },
                    {"role": "user", "content": request.message},
                ],
            },
        )

        result = response.json()

        return {
            "email": result["choices"][0]["message"]["content"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/competitor-analysis")
def competitor_analysis(request: AnalyzeRequest):

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a market intelligence analyst. Provide structured competitor analysis including strengths, weaknesses, pricing strategy, and market positioning."
                    },
                    {"role": "user", "content": request.message},
                ],
            },
        )

        result = response.json()

        return {
            "analysis": result["choices"][0]["message"]["content"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))