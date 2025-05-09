
require('dotenv').config({
  path: require('path').resolve(__dirname, '../../.env')
});

const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = {
  /**
   * Returns a real embedding for `text`.
   * @param {string} text
   * @returns {Promise<number[]>}
   */
  embed: async (text) => {
    const resp = await client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return resp.data[0].embedding;
  }
};
