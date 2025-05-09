#!/usr/bin/env python3
import os, json
from dotenv import load_dotenv
from openai import OpenAI

# 1. Load .env from project root
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(ROOT, ".env"))

# 2. Init client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# 3. Load your docs
with open(os.path.join(ROOT, "backend/src/data/documents.json")) as f:
    docs = json.load(f)

# 4. Compute embeddings
emb = {}
for doc in docs:
    resp = client.embeddings.create(
        model="text-embedding-ada-002",
        input=doc["snippet"]
    )
    emb[doc["id"]] = resp.data[0].embedding

# 5. Write to JSON
out = os.path.join(ROOT, "backend/src/data/embeddings.json")
with open(out, "w") as f:
    json.dump(emb, f)
print(f"Wrote {len(emb)} embeddings to {out}")
