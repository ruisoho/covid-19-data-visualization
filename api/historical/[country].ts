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

  const { country } = req.query;

  if (!country || typeof country !== 'string') {
    res.status(400).json({ error: 'Country parameter is required' });
    return;
  }

  try {
    const response = await axios.get(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=30`);
    res.status(200).json(response.data);
  } catch (error) {
    console.error(`Error fetching historical data for ${country}:`, error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
}