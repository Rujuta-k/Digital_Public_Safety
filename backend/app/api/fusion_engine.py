from fastapi import APIRouter
import random, time
router = APIRouter()

@router.post("/run")
def run_fusion():
    return {
        "fusion_id": f"FUS-{int(time.time())}",
        "signals_processed": random.randint(3500, 4500),
        "events_fused": random.randint(50, 70),
        "dedup_rate": round(random.uniform(0.90, 0.97), 3),
        "threat_index": random.randint(80, 99),
        "packages_generated": random.randint(2, 5),
    }

@router.get("/events")
def get_fusion_events():
    return [
        {"id": 1, "title": "Digital Arrest Ring — Mumbai/Delhi", "modules": ["scam", "fraud", "geo"], "score": 97, "action": "MHA Alert Issued"},
        {"id": 2, "title": "Counterfeit ₹500 Distribution Network", "modules": ["currency", "fraud", "geo"], "score": 89, "action": "RBI & Police Alerted"},
    ]

@router.get("/stats")
def get_stats():
    return {
        "total_threats": 1284,
        "fraud_prevented_cr": 47,
        "citizens_protected": 3129,
        "fraud_networks": 89,
        "counterfeit_notes": 412,
        "hotspot_zones": 234,
    }
