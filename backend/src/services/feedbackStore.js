const fs = require('fs');
const path = require('path');
const LOG = path.join(__dirname, '../data/feedback_log.json');
const WEIGHT = path.join(__dirname, '../data/feedback_weights.json');
let logs = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG)) : [];
let weights = fs.existsSync(WEIGHT) ? JSON.parse(fs.readFileSync(WEIGHT)) : {};
function persist() {
  fs.writeFileSync(LOG, JSON.stringify(logs, null,2));
  fs.writeFileSync(WEIGHT, JSON.stringify(weights, null,2));
}
async function logFeedback(entry) {
  entry.timestamp = Date.now();
  logs.push(entry);
  const delta = entry.feedback==='up'?0.1:-0.1;
  weights[entry.docId] = (weights[entry.docId]||0) + delta;
  persist();
}
function getLogs() { return logs; }
function applyFeedback(items) {
  return items.map(item => ({
    ...item,
    hybridScore: item.hybridScore + (weights[item.doc.id]||0)
  }));
}
module.exports = { logFeedback, getLogs, applyFeedback };
