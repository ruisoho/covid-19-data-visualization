import React from 'react';
import { Country } from '../types';

interface Props {
  country: Country | null;
}

const CountryDashboard: React.FC<Props> = ({ country }) => {
  if (!country) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '1rem',
          color: '#f8fafc'
        }}>Country Dashboard</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Select a country on the globe to see details.</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <img 
          src={country.countryInfo.flag} 
          alt={`${country.country} flag`} 
          style={{
            width: '48px',
            height: '32px',
            marginRight: '1rem',
            borderRadius: '4px',
            objectFit: 'cover'
          }} 
        />
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#f8fafc'
        }}>{country.country}</h2>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Cases</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fbbf24' }}>{country.cases.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Deaths</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>{country.deaths.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Recovered</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>{country.recovered.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Cases</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b' }}>{country.active.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Population</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#8b5cf6' }}>{country.population.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Tests Conducted</p>
          <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#06b6d4' }}>{country.tests.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CountryDashboard;