#!/usr/bin/env bash
set -e

echo "🔧 Setting up GleanLens project..."

# Go to project root (this script must be in root)
PROJECT_DIR=$(cd "$(dirname "$0")" && pwd)
cd "$PROJECT_DIR"

# 1) Install Node.js dependencies
echo "📦 Installing Node.js dependencies…"
npm install

# 2) Copy .env if needed
if [ -f backend/.env.example ] && [ ! -f backend/.env ]; then
  echo "📄 Copying backend/.env.example → backend/.env"
  cp backend/.env.example backend/.env
fi

# 3) Python venv + requirements
echo "🐍 Creating Python virtual environment…"
python3 -m venv python/venv

# Activate virtual environment in a subshell
echo "📥 Installing Python dependencies…"
source python/venv/bin/activate
pip install --upgrade pip
pip install -r python/requirements.txt
deactivate

# 4) Precompute embeddings
echo "⚙️ Running embedding precomputation…"
source python/venv/bin/activate
python python/embed_docs.py
deactivate

echo ""
echo "✅ GleanLens setup complete."
echo "👉 Run the app with: npm run dev"
