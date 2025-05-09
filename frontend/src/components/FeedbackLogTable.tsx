import React from 'react';
import type { FeedbackEntry } from '../types/models';

export default function FeedbackLogTable({ logs }: { logs: FeedbackEntry[] }) {
  return (
    <table>
      <thead>
        <tr><th>Time</th><th>Query</th><th>Doc</th><th>Feedback</th></tr>
      </thead>
      <tbody>
        {logs.map((l, i) => (
          <tr key={i}>
            <td>{new Date(l.timestamp).toLocaleString()}</td>
            <td>{l.query}</td>
            <td>{l.docId}</td>
            <td>{l.feedback}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
