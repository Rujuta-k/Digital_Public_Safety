from fastapi import APIRouter
router = APIRouter()

@router.get("/hotspots")
def get_hotspots():
    return [
        {"city": "Mumbai",    "lat": 19.076, "lng": 72.877, "intensity": 342, "type": "fraud",       "risk": "CRITICAL"},
        {"city": "Delhi",     "lat": 28.704, "lng": 77.102, "intensity": 289, "type": "scam",        "risk": "CRITICAL"},
        {"city": "Bangalore", "lat": 12.972, "lng": 77.594, "intensity": 218, "type": "cyber",       "risk": "HIGH"},
        {"city": "Hyderabad", "lat": 17.387, "lng": 78.491, "intensity": 175, "type": "counterfeit", "risk": "HIGH"},
        {"city": "Pune",      "lat": 18.520, "lng": 73.856, "intensity": 143, "type": "fraud",       "risk": "MEDIUM"},
    ]

@router.get("/patrol-status")
def get_patrol_status():
    return [
        {"city": "Mumbai",    "units": 12, "deployed": 9,  "coverage": 75},
        {"city": "Delhi",     "units": 15, "deployed": 13, "coverage": 87},
        {"city": "Bangalore", "units": 8,  "deployed": 6,  "coverage": 75},
    ]

@router.post("/deploy-patrol")
def deploy_patrol(city: str):
    return {"status": "deployed", "city": city, "eta_minutes": 8}
