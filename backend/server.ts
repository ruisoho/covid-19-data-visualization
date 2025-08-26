import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import https from 'https';

const app = express();
const port = 3002;

// Create an axios instance with a custom httpsAgent to accept self-signed certificates
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5175'],
  credentials: true 
}));

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

app.get('/api/historical/:country', async (req: Request, res: Response) => {
  try {
    const { country } = req.params;
    const response = await axiosInstance.get(`${DISEASE_SH_API}/historical/${country}?lastdays=all`);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching historical data for ${req.params.country}:`, error.message);
    res.status(500).json({ message: `Error fetching historical data for ${req.params.country}`, error: error.message });
  }
});

// WHO GHO API endpoints
app.get('/api/who/indicators', async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get('https://ghoapi.azureedge.net/api/Indicator');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching WHO indicators:', error.message);
    res.status(500).json({ message: 'Error fetching WHO indicators', error: error.message });
  }
});

app.get('/api/who/data/:indicatorCode', async (req: Request, res: Response) => {
  try {
    const { indicatorCode } = req.params;
    const response = await axiosInstance.get(`https://ghoapi.azureedge.net/api/${indicatorCode}`);
    res.json(response.data);
  } catch (error: any) {
    console.error(`Error fetching WHO data for ${req.params.indicatorCode}:`, error.message);
    res.status(500).json({ message: `Error fetching WHO data for ${req.params.indicatorCode}`, error: error.message });
  }
});

app.get('/api/who/countries', async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get('https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching WHO countries:', error.message);
    res.status(500).json({ message: 'Error fetching WHO countries', error: error.message });
  }
});

app.get('/api/who/outbreaks', async (req: Request, res: Response) => {
  try {
    const response = await axiosInstance.get('https://www.who.int/api/news/outbreaks');
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching WHO outbreaks:', error.message);
    res.status(500).json({ message: 'Error fetching WHO outbreaks', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});