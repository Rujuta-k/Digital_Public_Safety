# Digital_Public_Safety
AI for Digital Public Safety: Defeating Counterfeiting, Fraud &amp; Digital Arrest Scams
# SHIELD AI — Digital Public Safety Platform

<div align="center">
  <h3>🛡️ SHIELD AI</h3>
  <p><strong>Multi-Agent Intelligence Architecture for Digital Public Safety</strong></p>
  <p>
    <img src="https://img.shields.io/badge/MHA-Compliant-blue" />
    <img src="https://img.shields.io/badge/IT_Act-2000-green" />
    <img src="https://img.shields.io/badge/DPDP-2023-purple" />
    <img src="https://img.shields.io/badge/Version-2.1.0-orange" />
  </p>
</div>

---

## 🏗️ Architecture

```
SHIELD AI
├── Data Ingestion     → WhatsApp · Telecom CDR · Bank/UPI · Video/Device · NCRB/CCTNS
├── AI Modules         → 5 specialist agents (see below)
├── Agentic Fusion     → Multi-source intelligence correlation engine
├── AI Capability Stack→ NLP/LLMs · Computer Vision · Graph AI · Speech AI · GeoAI
├── Outputs & Actions  → MHA Alert · Field Officer · Evidence Package · Command Centre · NCRB
└── Infrastructure     → Privacy & Compliance · 12-Language NLP · Federated Learning · API Layer
```

## 🤖 AI Modules

| Module | Technology | Key Function |
|--------|-----------|--------------|
| **Scam Detector** | NLP + Speech AI | Digital arrest scam detection, MHA auto-alerts |
| **Currency ID** | Computer Vision | Counterfeit note identification, UV simulation |
| **Fraud Graph AI** | Graph AI | Money mule network mapping, court evidence packages |
| **Geospatial Intel** | GeoAI | Crime hotspot maps, patrol optimisation |
| **Citizen Shield** | Conversational AI | 12-language fraud risk assessment chatbot |

## 📁 Project Structure

```
shield-ai/
├── frontend/           # React + Vite frontend
│   ├── src/
│   │   ├── components/layout/    # Sidebar, Topbar
│   │   ├── pages/               # One page per module
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ScamDetector.jsx
│   │   │   ├── CurrencyID.jsx
│   │   │   ├── FraudGraph.jsx
│   │   │   ├── GeospatialIntel.jsx
│   │   │   ├── CitizenShield.jsx
│   │   │   └── FusionEngine.jsx
│   │   └── index.css            # Full design system
│   └── package.json
│
└── backend/            # FastAPI Python backend
    ├── app/
    │   ├── api/                  # Route handlers per module
    │   │   ├── scam_detector.py
    │   │   ├── currency_id.py
    │   │   ├── fraud_graph.py
    │   │   ├── geospatial.py
    │   │   ├── citizen_shield.py
    │   │   └── fusion_engine.py
    │   └── main.py
    └── requirements.txt
```

## 🚀 Setup & Run

### Prerequisites
- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **Python** 3.11+ ([python.org](https://python.org))

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate.bat

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# If you see errors about missing multipart support or uvicorn, install these
# (run inside the activated venv):
pip install python-multipart
python -m pip install "uvicorn[standard]"

# Start server
# Start server (use the venv-installed uvicorn)
uvicorn app.main:app --reload --port 8000
# API docs at http://localhost:8000/docs
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/`                     | Platform info |
| `GET`  | `/api/health`           | Health check |
| `POST` | `/api/scam/analyze`     | Analyze transcript for scam |
| `GET`  | `/api/scam/live-alerts` | Live scam alerts |
| `POST` | `/api/currency/analyze` | Identify counterfeit notes |
| `GET`  | `/api/fraud/network`    | Fraud network graph data |
| `GET`  | `/api/geo/hotspots`     | Crime hotspot data |
| `POST` | `/api/citizen/assess`   | Citizen fraud risk assessment |
| `POST` | `/api/fusion/run`       | Run fusion cycle |

## 🛡️ Compliance
- **IT Act 2000** — Cybercrime reporting and evidence standards
- **DPDP 2023** — Data Protection and Digital Privacy Act
- **MHA Guidelines** — Ministry of Home Affairs cybercrime protocols
- **NCRB Standards** — National Crime Records Bureau integration

## 📞 Emergency Contacts
- **Cyber Crime Helpline**: 1930
- **NCRB Portal**: [cybercrime.gov.in](https://cybercrime.gov.in)
- **MHA Cybercrime Division**: cybercell@mha.gov.in
