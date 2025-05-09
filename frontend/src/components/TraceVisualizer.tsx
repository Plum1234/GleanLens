import React from 'react';
import type { SearchTrace } from '../types/models';

export default function TraceVisualizer({ trace }: { trace: SearchTrace }) {
  return (
    <div className="trace-visualizer">
      <h4>Retrieval Trace</h4>
      <pre>{JSON.stringify(trace.retrieval, null, 2)}</pre>
      <h4>Reranking Trace</h4>
      <pre>{JSON.stringify(trace.reranked, null, 2)}</pre>
    </div>
  );
}
