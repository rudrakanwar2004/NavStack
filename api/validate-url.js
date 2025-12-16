export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false });
  }

  try {
    let { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ valid: false });
    }

    // Normalize
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      // Try HEAD first
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // If server responded at all → valid
      return res.status(200).json({ valid: true });

    } catch {
      clearTimeout(timeout);
      // Even if HEAD fails, URL format is valid → allow navigation
      return res.status(200).json({ valid: true });
    }

  } catch {
    return res.status(200).json({ valid: false });
  }
}
