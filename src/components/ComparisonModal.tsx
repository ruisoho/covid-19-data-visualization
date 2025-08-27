import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Country } from '../types';
import { covidApiService } from '../services/covidApi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountries: string[];
  countries: Country[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedCountries,
  countries
}) => {
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedCountries.length > 0) {
      fetchComparisonData();
    }
  }, [isOpen, selectedCountries]);

  const fetchComparisonData = async () => {
    setLoading(true);
    try {
      const data = await Promise.all(
        selectedCountries.map(async (countryCode) => {
          try {
            const historyData = await covidApiService.getCountryHistory(countryCode);
            const country = countries.find(c => c.countryInfo.iso2 === countryCode);
            return {
              country: country?.country || countryCode,
              data: historyData,
              currentCases: country?.cases || 0,
              currentDeaths: country?.deaths || 0,
              currentRecovered: country?.recovered || 0,
            };
          } catch (error) {
            console.error(`Error fetching data for ${countryCode}:`, error);
            return null;
          }
        })
      );
      setComparisonData(data.filter(d => d !== null));
    } catch (error) {
      console.error('Error fetching comparison data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentCasesData = {
    labels: comparisonData.map(d => d.country),
    datasets: [
      {
        label: 'Total Cases',
        data: comparisonData.map(d => d.currentCases),
        backgroundColor: 'rgba(251, 191, 36, 0.6)',
        borderColor: 'rgba(251, 191, 36, 1)',
        borderWidth: 2,
      },
    ],
  };

  const currentDeathsData = {
    labels: comparisonData.map(d => d.country),
    datasets: [
      {
        label: 'Total Deaths',
        data: comparisonData.map(d => d.currentDeaths),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
      },
    ],
  };

  const recoveredData = {
    labels: comparisonData.map(d => d.country),
    datasets: [
      {
        label: 'Total Recovered',
        data: comparisonData.map(d => d.currentRecovered),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f8fafc',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#94a3b8',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.95)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '80vw',
          maxHeight: '80vh',
          overflow: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
            Country Comparison
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '1.25rem',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: '#f8fafc', padding: '2rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem',
            }}></div>
            Loading comparison data...
          </div>
        ) : comparisonData.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#fbbf24', marginBottom: '1rem' }}>
                Total Cases
              </h4>
              <div style={{ height: '250px' }}>
                <Bar data={currentCasesData} options={chartOptions} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#ef4444', marginBottom: '1rem' }}>
                Total Deaths
              </h4>
              <div style={{ height: '250px' }}>
                <Bar data={currentDeathsData} options={chartOptions} />
              </div>
            </div>
            
            <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#10b981', marginBottom: '1rem' }}>
                Total Recovered
              </h4>
              <div style={{ height: '250px' }}>
                <Bar data={recoveredData} options={chartOptions} />
              </div>
            </div>
          </div>
        ) : (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
            No data available for the selected countries.
          </p>
        )}
      </div>
    </div>
  );
};

export default ComparisonModal;