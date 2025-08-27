import React, { useState } from 'react';
import { Country } from '../types';

interface CountryComparisonProps {
  countries: Country[];
  onOpenComparison: (selectedCountries: string[]) => void;
}

const CountryComparison: React.FC<CountryComparisonProps> = ({ countries, onOpenComparison }) => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showCountryList, setShowCountryList] = useState(false);

  const handleCountrySelect = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
    } else if (selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const removeCountry = (countryCode: string) => {
    setSelectedCountries(selectedCountries.filter(c => c !== countryCode));
  };

  const getCountryName = (countryCode: string) => {
    const country = countries.find(c => c.countryInfo.iso2 === countryCode);
    return country?.country || countryCode;
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      height: 'fit-content'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#f8fafc'
      }}>Country Comparison</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowCountryList(!showCountryList)}
          style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '0.5rem 1rem',
            color: '#93c5fd',
            fontSize: '0.875rem',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'left',
            marginBottom: '0.5rem'
          }}
        >
          {showCountryList ? 'Hide Countries' : 'Select Countries'} ({selectedCountries.length}/5)
        </button>
        
        {showCountryList && (
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            background: 'rgba(15, 23, 42, 0.8)'
          }}>
            {countries.slice(0, 50).map((country) => (
              <button
                key={country.countryInfo.iso2}
                onClick={() => handleCountrySelect(country.countryInfo.iso2)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  textAlign: 'left',
                  fontSize: '0.875rem',
                  border: 'none',
                  background: selectedCountries.includes(country.countryInfo.iso2)
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'transparent',
                  color: selectedCountries.includes(country.countryInfo.iso2)
                    ? '#93c5fd'
                    : '#cbd5e1',
                  cursor: selectedCountries.length >= 5 && !selectedCountries.includes(country.countryInfo.iso2)
                    ? 'not-allowed'
                    : 'pointer',
                  opacity: selectedCountries.length >= 5 && !selectedCountries.includes(country.countryInfo.iso2)
                    ? 0.5
                    : 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                disabled={selectedCountries.length >= 5 && !selectedCountries.includes(country.countryInfo.iso2)}
                onMouseEnter={(e) => {
                  if (!selectedCountries.includes(country.countryInfo.iso2) && selectedCountries.length < 5) {
                    (e.target as HTMLElement).style.background = 'rgba(71, 85, 105, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selectedCountries.includes(country.countryInfo.iso2)) {
                    (e.target as HTMLElement).style.background = 'transparent';
                  }
                }}
              >
                {country.country}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedCountries.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Selected Countries:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {selectedCountries.map((countryCode) => (
              <span
                key={countryCode}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  color: '#93c5fd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}
              >
                <span style={{ 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  maxWidth: 'calc(100% - 20px)'
                }}>
                  {getCountryName(countryCode)}
                </span>
                <button
                  onClick={() => removeCountry(countryCode)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#f87171',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {selectedCountries.length >= 2 && (
        <button
          onClick={() => onOpenComparison(selectedCountries)}
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2))',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#10b981',
            fontSize: '0.875rem',
            fontWeight: '500',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          📊 View Comparison Charts
        </button>
      )}

      {selectedCountries.length < 2 && (
        <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', padding: '1rem' }}>
          Select at least 2 countries to compare their COVID-19 data.
        </p>
      )}

    </div>
  );
};

export default CountryComparison;