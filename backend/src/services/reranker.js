module.exports = {
  rerank: async (_query, candidates) => candidates.map(c => ({
    doc: c.doc,
    rerankScore: c.hybridScore
  }))
};
