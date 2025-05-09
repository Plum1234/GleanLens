const fs   = require('fs');
const path = require('path');
const { applyFeedback } = require('./feedbackStore');

// Load embeddings.json { id: […], … }
const embeddings = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/embeddings.json'), 'utf-8')
);
// Load doc metadata
const docs = require('../data/documents.json');

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i]*a[i];
    nb  += b[i]*b[i];
  }
  return dot / (Math.sqrt(na)*Math.sqrt(nb) + 1e-8);
}

module.exports = {
  retrieve: (queryVec, n = 5) => {
    // score every doc by cosine similarity
    const scored = docs.map(doc => {
      const vec = embeddings[doc.id];
      const sim = cosine(queryVec, vec);
      return { doc, bm25Score: sim, vectorScore: sim, hybridScore: sim };
    });
    // also apply the feedback that users gave like if one teacher is better than another
    const adjusted = applyFeedback(scored);
    //  sort and return the top n
    return adjusted
      .sort((a,b) => b.hybridScore - a.hybridScore)
      .slice(0, n);
  }
};
