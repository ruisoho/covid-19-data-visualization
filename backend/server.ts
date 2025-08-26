import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';

const app = express();
const port = 3000;

// Create an axios instance with a custom httpsAgent to accept self-signed certificates
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

app.use(cors({ origin: 'http://localhost:5174' }));

// Add a logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

const DISEASE_SH_API = 'https://disease.sh/v3/covid-19';

app.get('/api/global', async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get(`${DISEASE_SH_API}/all`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching global data:', error.message);
    res.status(500).json({ message: 'Error fetching global data', error: error.message });
  }
});

app.get('/api/countries', async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get(`${DISEASE_SH_API}/countries`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching countries data:', error.message);
    res.status(500).json({ message: 'Error fetching countries data', error: error.message });
  }
});

app.get('/api/historical/all', async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get(`${DISEASE_SH_API}/historical/all?lastdays=all`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({ message: 'Error fetching historical data', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});