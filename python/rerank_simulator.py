#!/usr/bin/env python3
import os
import json
import argparse
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI

# ─── Load configuration ────────────────────────────────────────────────────────
# Point dotenv at your project‐root .env
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(ROOT, ".env"))

# Instantiate the OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# ─── Helpers ───────────────────────────────────────────────────────────────────
def cosine(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

def embed_query(text: str) -> np.ndarray:
    resp = client.embeddings.create(
        model="text-embedding-ada-002",
        input=text
    )
    return np.array(resp.data[0].embedding)

# ─── Main ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Offline rerank simulator: retrieve + rerank on embeddings"
    )
    parser.add_argument(
        "--embeddings",
        default="embeddings.parquet",
        help="Path to embeddings.parquet (columns: id, embedding[list])"
    )
    parser.add_argument(
        "--docs",
        default="../backend/src/data/documents.json",
        help="Path to documents.json (list of docs with field 'id')"
    )
    parser.add_argument(
        "--topk",
        type=int,
        default=5,
        help="How many docs to retrieve"
    )
    parser.add_argument(
        "queries",
        nargs="+",
        help="One or more queries to simulate"
    )
    args = parser.parse_args()

    # Load doc embeddings
    emb_df = pd.read_parquet(args.embeddings)
    emb_df["embedding"] = emb_df["embedding"].apply(lambda e: np.array(e))

    # Load metadata
    with open(args.docs, "r") as f:
        docs = json.load(f)
    meta_df = pd.DataFrame(docs)

    # Merge on id
    df = meta_df.merge(emb_df, on="id")

    for query in args.queries:
        print(f"\n=== Query: “{query}” ===")

        # 1) Embed
        q_vec = embed_query(query)

        # 2) Retrieve by cosine
        df["score"] = df["embedding"].apply(lambda e: cosine(q_vec, e))
        retrieved = df.nlargest(args.topk, "score").reset_index(drop=True)

        print(f"\n-- Retrieval (top {args.topk} by cosine) --")
        for i, row in retrieved.iterrows():
            print(f"{i+1}. [{row['id']}] {row['title']}  (score={row['score']:.4f})")

        # 3) Rerank: add tiny random noise to simulate a learned reranker
        np.random.seed(42)
        noise = np.random.normal(scale=0.02, size=len(retrieved))
        retrieved["rerankScore"] = retrieved["score"] * (1 + noise)

        reranked = retrieved.sort_values("rerankScore", ascending=False).reset_index(drop=True)
        print("\n-- Reranking (after perturbation) --")
        for i, row in reranked.iterrows():
            print(f"{i+1}. [{row['id']}] {row['title']}  (rerankScore={row['rerankScore']:.4f})")
