// Load your .env from the project root
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express       = require('express');
const cors          = require('cors');
// … rest of your imports …

const embedder = require('./services/embedder');
const retriever = require('./services/retriever');
const reranker = require('./services/reranker');
const feedbackStore = require('./services/feedbackStore');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  const embedded = await embedder.embed(query);
  let retrieval = retriever.retrieve(embedded);
  retrieval = feedbackStore.applyFeedback(retrieval);
  const reranked = await reranker.rerank(query, retrieval);
  res.json({ query, embeddedQuery: embedded, retrieval, reranked });
});

app.post('/api/feedback', async (req, res) => {
  await feedbackStore.logFeedback(req.body);
  res.json({ success: true });
});

app.get('/api/logs', (req, res) => {
  res.json(feedbackStore.getLogs());
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
