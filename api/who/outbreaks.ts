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

  try {
    // WHO doesn't have a public outbreaks API, so we'll provide mock data for now
    const mockOutbreaks = [
      {
        id: '1',
        title: 'COVID-19 Pandemic',
        description: 'Global pandemic caused by SARS-CoV-2 virus',
        country: 'Global',
        date: '2019-12-31',
        disease: 'COVID-19',
        status: 'ongoing'
      },
      {
        id: '2',
        title: 'Mpox Outbreak',
        description: 'Multi-country outbreak of mpox',
        country: 'Multiple',
        date: '2022-05-13',
        disease: 'Mpox',
        status: 'ongoing'
      }
    ];
    
    res.status(200).json({ value: mockOutbreaks });
  } catch (error) {
    console.error('Error fetching WHO outbreaks:', error);
    res.status(500).json({ error: 'Failed to fetch WHO outbreaks' });
  }
}