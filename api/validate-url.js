// api/validate-url.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false });
  }

  try {
    let { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ valid: false });
    }

    // Normalize and validate URL format
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    try {
      // Ensure the string is a valid URL
      new URL(url);
    } catch {
      return res.status(200).json({ valid: false });
    }

    const timeoutMs = 3000;
    const tryFetch = async (method) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          method,
          redirect: 'follow',
          signal: controller.signal,
          // Add a simple UA to improve chances (some sites reject unknown UA)
          headers: { 'User-Agent': 'NavStackValidator/1.0' },
        });
        clearTimeout(timer);
        return response;
      } catch (err) {
        clearTimeout(timer);
        throw err;
      }
    };

    // Try HEAD first
    try {
      const headRes = await tryFetch('HEAD');
      if (headRes && headRes.status < 400) {
        return res.status(200).json({ valid: true });
      }
      // If HEAD returned 4xx/5xx, treat as unreachable and proceed to GET fallback
    } catch (headErr) {
      // HEAD failed — we'll try GET below
    }

    // Fallback: GET (some servers don't allow HEAD)
    try {
      const getRes = await tryFetch('GET');
      if (getRes && getRes.status < 400) {
        return res.status(200).json({ valid: true });
      } else {
        return res.status(200).json({ valid: false });
      }
    } catch (getErr) {
      // GET failed too — treat as unreachable
      return res.status(200).json({ valid: false });
    }

  } catch (err) {
    return res.status(200).json({ valid: false });
  }
}
