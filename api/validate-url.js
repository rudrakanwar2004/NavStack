import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false });
  }

  try {
    let { url } = req.body || {};
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ valid: false });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 Chrome/120 Safari/537.36',
        },
      });

      clearTimeout(timeout);

      if (response.status < 400) {
        return res.json({ valid: true });
      }

      return res.json({ valid: false, reason: 'HTTP_4XX' });

    } catch (err) {
      clearTimeout(timeout);
      return res.json({ valid: true, reason: 'BLOCKED_OR_EXISTS' });
    }

  } catch {
    return res.json({ valid: false, reason: 'UNKNOWN_ERROR' });
  }
}
