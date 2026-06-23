from fastapi import APIRouter
router = APIRouter()

@router.get("/network")
def get_network():
    return {"nodes": [
        {"id": "scammer1", "type": "scammer", "label": "S-001"},
        {"id": "mule1",    "type": "mule",    "label": "M-001"},
        {"id": "victim1",  "type": "victim",  "label": "V-001"},
    ], "links": [
        {"source": "victim1", "target": "scammer1", "value": 2},
        {"source": "scammer1","target": "mule1",    "value": 4},
    ]}

@router.get("/cases")
def get_cases():
    return [
        {"id": "FC-2024-001", "name": "Operation Cyber Shakti", "scammers": 4, "mules": 12, "victims": 89, "amount": "₹2.3 Cr", "status": "Court Admissible"},
        {"id": "FC-2024-002", "name": "UPI Ring — Hyderabad",   "scammers": 2, "mules": 7,  "victims": 34, "amount": "₹67 Lakh","status": "Investigation"},
    ]

@router.post("/evidence-package")
def generate_evidence(case_id: str = "FC-2024-001"):
    return {"package_id": f"EVP-{case_id}", "status": "generated", "encrypted": True, "admissible": True, "hash": "sha256:abc123def456"}
