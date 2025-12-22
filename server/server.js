import express from 'express';
import cors from 'cors';
import dns from 'dns/promises';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/validate-url', async (req, res) => {
  console.log('🔥 VALIDATOR HIT', req.body);

  try {
    let { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.json({ valid: false, reason: 'INVALID_INPUT' });
    }

    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    const hostname = new URL(url).hostname;

    try {
      await dns.lookup(hostname);
      return res.json({ valid: true });
    } catch {
      return res.json({ valid: false, reason: 'DNS_NOT_FOUND' });
    }

  } catch (err) {
    console.error(err);
    return res.json({ valid: false, reason: 'SERVER_ERROR' });
  }
});

app.listen(5000, () => {
  console.log('✅ Backend running on http://localhost:5000');
});
