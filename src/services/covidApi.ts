import axios from 'axios';
import { Country, GlobalData, HistoricalData } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:3002/api');

class CovidApiService {
  private api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
  });

  async getGlobalData(): Promise<GlobalData> {
    try {
      const response = await this.api.get('/global');
      return response.data;
    } catch (error) {
      console.error('Error fetching global data:', error);
      throw error;
    }
  }

  async getCountries(): Promise<Country[]> {
    try {
      const response = await this.api.get('/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching countries data:', error);
      throw error;
    }
  }

  async getCountryHistory(countryCode: string): Promise<HistoricalData> {
    try {
      const response = await this.api.get(`/historical/${countryCode}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching historical data for ${countryCode}:`, error);
      throw error;
    }
  }
}

export const covidApiService = new CovidApiService();