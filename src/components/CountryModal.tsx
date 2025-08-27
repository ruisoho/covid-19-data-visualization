import React from 'react';
import { Country } from '../types';

interface Props {
  country: Country | null;
  isOpen: boolean;
  onClose: () => void;
}

const CountryModal: React.FC<Props> = ({ country, isOpen, onClose }) => {
  if (!isOpen || !country) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '16px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#f8fafc',
              margin: 0
            }}>{country.country}</h2>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              padding: '0.5rem',
              cursor: 'pointer',
              fontSize: '1.25rem',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(251, 191, 36, 0.1)',
            border: '1px solid rgba(251, 191, 36, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#fbbf24', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Total Cases</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.cases.toLocaleString()}</p>
          </div>
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Total Deaths</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.deaths.toLocaleString()}</p>
          </div>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#10b981', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Recovered</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.recovered.toLocaleString()}</p>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#f59e0b', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Active Cases</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.active.toLocaleString()}</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#8b5cf6', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Population</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.population.toLocaleString()}</p>
          </div>
          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#06b6d4', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Tests Conducted</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.tests.toLocaleString()}</p>
          </div>
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#a855f7', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Cases per Million</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.casesPerOneMillion?.toLocaleString() || 'N/A'}</p>
          </div>
          <div style={{
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ color: '#ec4899', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: '600' }}>Deaths per Million</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>{country.deathsPerOneMillion?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;