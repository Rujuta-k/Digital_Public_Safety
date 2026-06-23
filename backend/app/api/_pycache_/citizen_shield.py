from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

class AssessRequest(BaseModel):
    message: str
    language: str = "en"

@router.post("/assess")
def assess_risk(req: AssessRequest):
    text = req.message.lower()
    risk = 40
    verdict = "LOW RISK"
    if any(w in text for w in ["cbi", "arrest", "video call", "transfer"]):
        risk = 97; verdict = "SCAM CONFIRMED"
    elif any(w in text for w in ["upi", "pin", "prize", "won"]):
        risk = 89; verdict = "SCAM CONFIRMED"
    elif any(w in text for w in ["kyc", "sim", "block", "aadhaar"]):
        risk = 85; verdict = "HIGH RISK SCAM"
    elif any(w in text for w in ["job", "fee", "registration", "advance"]):
        risk = 72; verdict = "LIKELY SCAM"
    return {"risk_score": risk, "verdict": verdict, "ncrb_url": "https://cybercrime.gov.in", "helpline": "1930"}

@router.get("/languages")
def get_languages():
    return [
        {"code": "en", "name": "English"}, {"code": "hi", "name": "Hindi"},
        {"code": "mr", "name": "Marathi"}, {"code": "ta", "name": "Tamil"},
        {"code": "te", "name": "Telugu"},  {"code": "kn", "name": "Kannada"},
        {"code": "gu", "name": "Gujarati"},{"code": "bn", "name": "Bengali"},
        {"code": "pa", "name": "Punjabi"}, {"code": "or", "name": "Odia"},
        {"code": "ml", "name": "Malayalam"},{"code": "ur", "name": "Urdu"},
    ]
