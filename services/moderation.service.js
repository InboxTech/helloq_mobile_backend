// const fetch = require('node-fetch');
// Node 18+ already has global fetch
const moderateText = async (text) => {
  return 0.1; // your placeholder
};

const moderateImage = async (url) => {
  const res = await fetch(
    'https://api.huggingface.co/models/Falconsai/nsfw_image_detection',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
      body: JSON.stringify({ inputs: url })
    }
  );

  const result = await res.json();
  return result[0]?.label === 'nsfw' && result[0]?.score > 0.8;
};

module.exports = { moderateText, moderateImage };