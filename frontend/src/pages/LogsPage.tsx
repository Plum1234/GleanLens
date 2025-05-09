import React, { useEffect, useState } from 'react';
import FeedbackLogTable from '../components/FeedbackLogTable';
import { fetchLogs } from '../utils/api';
import type { FeedbackEntry } from '../types/models';

export default function LogsPage() {
  const [logs, setLogs] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    fetchLogs().then(setLogs);
  }, []);

  return (
    <div className="page">
      <h2>Feedback Logs</h2>
      <FeedbackLogTable logs={logs} />
    </div>
  );
}
