import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false });
  }

  let { url } = req.body;

  if (!url) {
    return res.status(400).json({ valid: false });
  }

  // Normalize
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    await axios.head(url, {
      timeout: 3000,
      maxRedirects: 5,
      validateStatus: status => status < 500,
    });

    return res.status(200).json({ valid: true });
  } catch {
    return res.status(200).json({ valid: false });
  }
}
