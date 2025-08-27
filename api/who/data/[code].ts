import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Disease code is required' });
    return;
  }

  try {
    const response = await axios.get(`https://ghoapi.azureedge.net/api/${code}`, {
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
      }
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching WHO data for ${code}:`, error);
    res.status(500).json({ error: `Failed to fetch WHO data for ${code}` });
  }
}