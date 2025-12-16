export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false });
  }

  try {
    let { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ valid: false });
    }

    // Normalize URL
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    });

    clearTimeout(timeout);

    return res.status(200).json({ valid: response.ok });
  } catch (err) {
    return res.status(200).json({ valid: false });
  }
}
