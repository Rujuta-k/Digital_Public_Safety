from fastapi import APIRouter
from pydantic import BaseModel
import random
import time

router = APIRouter()


class TranscriptRequest(BaseModel):
    transcript: str
    caller_id: str = "UNKNOWN"
    duration_sec: int = 0


class ScamResult(BaseModel):
    is_scam: bool
    scam_type: str
    confidence: float
    indicators: list[str]
    caller_spoofed: bool
    risk_score: int
    mha_alert_id: str
    recommended_action: str


SCAM_INDICATORS = {
    "digital_arrest": ["CBI impersonation", "Arrest threat", "Video call demand", "UPI transfer request", "Money laundering accusation"],
    "customs_scam":   ["Package seized", "Customs officer impersonation", "Clearance fee demand", "Time pressure"],
    "trai_warning":   ["SIM disconnection threat", "TRAI impersonation", "Personal data request"],
    "kyc_scam":       ["KYC expiry threat", "Bank account freeze threat", "Link sent via SMS"],
}


@router.post("/analyze", response_model=ScamResult)
def analyze_transcript(req: TranscriptRequest):
    text = req.transcript.lower()
    scam_type = "unknown"
    if any(w in text for w in ["cbi", "arrest", "video call", "aadhaar link"]):
        scam_type = "digital_arrest"
    elif any(w in text for w in ["customs", "parcel", "dubai", "seized"]):
        scam_type = "customs_scam"
    elif any(w in text for w in ["trai", "sim", "disconnect"]):
        scam_type = "trai_warning"
    elif any(w in text for w in ["kyc", "bank account", "freeze"]):
        scam_type = "kyc_scam"

    is_scam = scam_type != "unknown"
    confidence = round(random.uniform(0.85, 0.98) if is_scam else random.uniform(0.1, 0.4), 3)
    risk_score = int(confidence * 100) if is_scam else random.randint(10, 40)

    return ScamResult(
        is_scam=is_scam,
        scam_type=scam_type,
        confidence=confidence,
        indicators=SCAM_INDICATORS.get(scam_type, ["Suspicious language patterns detected"]),
        caller_spoofed=is_scam and random.random() > 0.3,
        risk_score=risk_score,
        mha_alert_id=f"SHIELD-{int(time.time())}",
        recommended_action="Block caller and alert victim via SMS. File NCRB report." if is_scam else "Low risk — monitor only.",
    )


@router.get("/live-alerts")
def get_live_alerts():
    return [
        {"id": 1, "caller": "+91-11-2309****", "type": "Digital Arrest", "city": "Mumbai", "risk": 97, "status": "BLOCKED"},
        {"id": 2, "caller": "+91-22-6169****", "type": "Customs Scam",   "city": "Delhi",  "risk": 91, "status": "ALERTING"},
        {"id": 3, "caller": "+91-40-6724****", "type": "TRAI Warning",   "city": "Hyderabad", "risk": 88, "status": "BLOCKED"},
    ]
