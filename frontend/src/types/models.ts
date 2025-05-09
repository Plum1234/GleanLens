export interface Doc { id: string; title: string; snippet: string; }
export interface RetrievalItem { doc: Doc; bm25Score: number; vectorScore: number; hybridScore: number; }
export interface RerankedItem { doc: Doc; rerankScore: number; }
export interface SearchTrace { query: string; embeddedQuery: number[]; retrieval: RetrievalItem[]; reranked: RerankedItem[]; }
export interface FeedbackEntry { timestamp: number; query: string; docId: string; feedback: 'up' | 'down'; }
