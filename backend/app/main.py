from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import scam_detector, currency_id, fraud_graph, geospatial, citizen_shield, fusion_engine

app = FastAPI(
    title="SHIELD AI — Digital Public Safety Platform",
    description="Multi-agent intelligence architecture for digital public safety",
    version="2.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(scam_detector.router,  prefix="/api/scam",     tags=["Scam Detector"])
app.include_router(currency_id.router,    prefix="/api/currency", tags=["Currency ID"])
app.include_router(fraud_graph.router,    prefix="/api/fraud",    tags=["Fraud Graph"])
app.include_router(geospatial.router,     prefix="/api/geo",      tags=["Geospatial"])
app.include_router(citizen_shield.router, prefix="/api/citizen",  tags=["Citizen Shield"])
app.include_router(fusion_engine.router,  prefix="/api/fusion",   tags=["Fusion Engine"])


@app.get("/")
def root():
    return {
        "platform": "SHIELD AI — Digital Public Safety Platform",
        "version": "2.1.0",
        "modules": ["scam-detector", "currency-id", "fraud-graph", "geospatial-intel", "citizen-shield"],
        "status": "operational",
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "modules": 5, "fusion": "active"}
