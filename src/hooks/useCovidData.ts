import { useState, useEffect } from 'react';
import { Country, GlobalData, HistoricalData } from '../types';
import { covidApiService } from '../services/covidApi';

export const useCovidData = () => {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [countryHistory, setCountryHistory] = useState<HistoricalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [global, countriesData] = await Promise.all([
          covidApiService.getGlobalData(),
          covidApiService.getCountries(),
        ]);
        const filteredCountries = countriesData.filter((country: Country) => {
          const { lat, long } = country.countryInfo;
          return (
            lat !== null &&
            long !== null &&
            !isNaN(lat) &&
            !isNaN(long) &&
            lat >= -90 &&
            lat <= 90 &&
            long >= -180 &&
            long <= 180
          );
        });
        setGlobalData(global);
        setCountries(filteredCountries);
      } catch (error) {
        console.error('Error fetching initial data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchCountryHistory = async (countryCode: string) => {
    setLoading(true);
    try {
      const history = await covidApiService.getCountryHistory(countryCode);
      setCountryHistory(history);
      const country = countries.find(c => c.countryInfo.iso2 === countryCode);
      setSelectedCountry(country || null);
    } catch (error) {
      console.error(`Error fetching history for ${countryCode}`, error);
    } finally {
      setLoading(false);
    }
  };

  return { globalData, countries, selectedCountry, countryHistory, loading, fetchCountryHistory };
};