import React from 'react';
import { GlobalData } from '../types';

interface Props {
  globalData: GlobalData | null;
}

const GlobalOverview: React.FC<Props> = ({ globalData }) => {
  if (!globalData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        color: '#f8fafc'
      }}>Global Overview</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Cases</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24' }}>{globalData.cases.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Deaths</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>{globalData.deaths.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Total Recovered</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>{globalData.recovered.toLocaleString()}</p>
        </div>
        <div>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Active Cases</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>{globalData.active.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalOverview;