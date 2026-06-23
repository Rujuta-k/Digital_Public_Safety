#!/bin/bash
echo "====================================================="
echo " SHIELD AI - Digital Public Safety Platform Setup"
echo "====================================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js not found. Install from: https://nodejs.org"
    exit 1
fi
echo "[OK] Node.js: $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 not found. Install from: https://python.org"
    exit 1
fi
echo "[OK] Python: $(python3 --version)"

echo ""
echo "Installing Frontend Dependencies..."
cd "$(dirname "$0")/frontend"
npm install

echo ""
echo "Setting up Python Virtual Environment..."
cd "$(dirname "$0")/backend"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "====================================================="
echo " SETUP COMPLETE!"
echo "====================================================="
echo ""
echo "Run in TWO terminals:"
echo ""
echo "Terminal 1 (Frontend):"
echo "  cd frontend && npm run dev"
echo "  Open: http://localhost:3000"
echo ""
echo "Terminal 2 (Backend):"
echo "  cd backend && source venv/bin/activate"
echo "  uvicorn app.main:app --reload --port 8000"
echo "  API docs: http://localhost:8000/docs"
