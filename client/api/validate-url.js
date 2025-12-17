export const config = {
  runtime: 'nodejs',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false });
  }

  try {
    const { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ valid: false });
    }

    let normalized = url;
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const response = await fetch(normalized, {
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

    } catch {
      clearTimeout(timeout);
      // blocked but site exists
      return res.json({ valid: true, reason: 'BLOCKED_OR_EXISTS' });
    }

  } catch (err) {
    console.error('Validator error:', err);
    return res.status(500).json({ valid: false, reason: 'SERVER_ERROR' });
  }
}
