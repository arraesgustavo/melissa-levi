#!/usr/bin/env bash
set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cleanup() {
  echo ""
  echo "Encerrando servidores..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
  wait $BACKEND_PID $FRONTEND_PID 2>/dev/null
  echo "Servidores encerrados."
}
trap cleanup EXIT INT TERM

echo "============================================"
echo "  Melissa & Levi - Dev Servers"
echo "============================================"
echo ""

# Backend
echo "[backend] Ativando venv e iniciando FastAPI..."
cd "$PROJECT_DIR/backend"
source venv/bin/activate
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Frontend
echo "[frontend] Instalando dependências e iniciando Vite..."
cd "$PROJECT_DIR/frontend"
npm install --silent
npm run dev &
FRONTEND_PID=$!

echo ""
echo "============================================"
echo "  Backend:  http://localhost:8000"
echo "  Docs:     http://localhost:8000/docs"
echo "  Frontend: http://localhost:5173"
echo "============================================"
echo ""
echo "Pressione Ctrl+C para encerrar."

wait
