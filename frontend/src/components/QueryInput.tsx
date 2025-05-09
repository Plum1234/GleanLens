import React, { useState } from 'react';

interface Props {
  onSubmit: (q: string) => void;
}

export default function QueryInput({ onSubmit }: Props) {
  const [q, setQ] = useState('');
  return (
    <div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Enter query" />
      <button onClick={() => onSubmit(q)}>Search</button>
    </div>
  );
}
