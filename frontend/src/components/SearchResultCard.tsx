// frontend/src/components/SearchResultCard.tsx
import React from 'react';
import type { Doc } from '../types/models';

interface Props {
  doc: Doc & {
    author: string;
    lastModified: string;
    tags: string[];
    fileType: string;
  };
  score: number;
  onFeedback: (id: string, fb: 'up'|'down') => void;
}

export default function SearchResultCard({ doc, score, onFeedback }: Props) {
  return (
    <div className="result-card">
      <h3>{doc.title}</h3>
      <p className="snippet">{doc.snippet}</p>
      <small>
        {doc.author} · {new Date(doc.lastModified).toLocaleDateString()} · {doc.fileType.toUpperCase()}
      </small>
      <div className="tags">
        {doc.tags.map(t => (
          <span key={t} className="tag">{t}</span>
        ))}
      </div>
      <div>Score: {score.toFixed(3)}</div>
      <button onClick={() => onFeedback(doc.id, 'up')}>👍</button>
      <button onClick={() => onFeedback(doc.id, 'down')}>👎</button>
    </div>
  );
}
