import React, { useState } from 'react';
import QueryInput from '../components/QueryInput';
import SearchResultCard from '../components/SearchResultCard';
import TraceVisualizer from '../components/TraceVisualizer';
import { searchAPI, sendFeedback } from '../utils/api';
import type { SearchTrace } from '../types/models';

export default function SearchPage() {
  const [trace, setTrace] = useState<SearchTrace | null>(null);

  async function handleSearch(query: string) {
    const data = await searchAPI(query);
    setTrace(data);
  }

  async function handleFeedback(docId: string, feedback: 'up'|'down') {
    if (!trace) return;
    await sendFeedback({ query: trace.query, docId, feedback });
    const refreshed = await searchAPI(trace.query);
    setTrace(refreshed);
  }

  return (
    <div className="search-container">
      <QueryInput onSubmit={handleSearch} />

      {trace && (
        <>
          {/* 1) Render all your result cards */}
          {trace.reranked.map((d) => (
            <SearchResultCard
              key={d.doc.id}
              doc={d.doc}
              score={d.rerankScore}
              onFeedback={handleFeedback}
            />
          ))}

          {/* 2) Then render the full trace UNDER the cards */}
          <TraceVisualizer trace={trace} />
        </>
      )}
    </div>
  );
}
