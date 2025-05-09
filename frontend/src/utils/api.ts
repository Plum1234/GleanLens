import axios from 'axios';
import type { SearchTrace, FeedbackEntry } from '../types/models';

export async function searchAPI(query: string): Promise<SearchTrace> {
  const res = await axios.post('/api/search', { query });
  return res.data;
}

export async function sendFeedback(entry: FeedbackEntry): Promise<void> {
  await axios.post('/api/feedback', entry);
}

export async function fetchLogs(): Promise<FeedbackEntry[]> {
  const res = await axios.get('/api/logs');
  return res.data;
}
