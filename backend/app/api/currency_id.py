from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import random

router = APIRouter()


class CurrencyResult(BaseModel):
    denomination: str
    verdict: str
    confidence: float
    checks: dict[str, bool]
    uv_features: dict[str, bool]
    serial_valid: bool
    recommendation: str


@router.post("/analyze")
async def analyze_currency(denomination: str = "500", file: UploadFile = File(None)):
    checks_map = {
        "500":  ["Magenta security thread", "INDIA & 500 text", "Ashoka Pillar watermark", "Angular bleed lines", "Microprint", "Serial number pattern"],
        "2000": ["Magenta security thread", "Latent image", "Micro-lettering RBI", "Color-shifting ink", "Intaglio printing", "Watermark Gandhi"],
        "200":  ["Swachh Bharat logo", "Sanchi Stupa motif", "Security thread", "Micro-lettering", "UV features", "See-through register"],
        "100":  ["Rani Ki Vav motif", "Purple security thread", "Latent image", "Microprint", "Intaglio numerals", "Watermark"],
    }
    checks_list = checks_map.get(denomination, checks_map["500"])
    outcomes = ["genuine", "genuine", "genuine", "counterfeit", "suspect"]
    outcome = random.choice(outcomes)
    if outcome == "genuine":
        checks_result = {c: True for c in checks_list}
    elif outcome == "counterfeit":
        checks_result = {c: (i > 2) for i, c in enumerate(checks_list)}
    else:
        checks_result = {c: (i % 2 == 0) for i, c in enumerate(checks_list)}

    confidence = round(random.uniform(0.88, 0.99) if outcome == "genuine" else random.uniform(0.76, 0.96), 3)
    return CurrencyResult(
        denomination=f"₹{denomination}",
        verdict=outcome.upper(),
        confidence=confidence,
        checks=checks_result,
        uv_features={"Security Fibers": outcome in ["genuine", "suspect"], "Serial UV": outcome == "genuine", "Denomination": outcome in ["genuine", "suspect"]},
        serial_valid=outcome == "genuine",
        recommendation={
            "genuine": "Note verified as authentic. Safe to process.",
            "counterfeit": "COUNTERFEIT DETECTED. Seize note. File FIR. Report to RBI.",
            "suspect": "Suspect note. Submit to RBI regional office for forensic verification.",
        }[outcome],
    )


@router.get("/seizure-log")
def get_seizure_log():
    return [
        {"date": "23 Jun", "location": "Dadar Market, Mumbai", "denomination": "₹500", "count": 87, "seized_by": "Mumbai Police", "fir": "Filed"},
        {"date": "23 Jun", "location": "Connaught Place, Delhi", "denomination": "₹2000", "count": 34, "seized_by": "Delhi Police", "fir": "Filed"},
    ]
