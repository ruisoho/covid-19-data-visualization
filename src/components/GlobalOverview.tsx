import React from 'react';
import { GlobalData } from '../types';
import { Disease } from './DiseaseSelector';

interface Props {
  globalData: GlobalData | null;
  selectedDisease?: Disease | undefined;
}

const GlobalOverview: React.FC<Props> = ({ globalData, selectedDisease }) => {
  if (!globalData) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#94a3b8'
        }}>
          <div className="spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ fontSize: '0.875rem' }}>Loading {selectedDisease?.name || 'disease'} data...</span>
        </div>
      </div>
    );
  }

  // Get appropriate labels based on disease type
  const getLabelsForDisease = () => {
    if (selectedDisease?.code === 'HIV_ARTCOVERAGE') {
      return {
        metric1: 'People in Treatment',
        metric2: 'Highest Country Treatment', 
        metric3: 'Average per Country',
        metric4: 'Countries with Data',
        suffix1: '',
        suffix2: '',
        suffix3: '',
        suffix4: ''
      };
    } else if (selectedDisease?.source === 'covid') {
      return {
        metric1: 'Total Cases',
        metric2: 'Total Deaths',
        metric3: 'Total Recovered', 
        metric4: 'Active Cases',
        suffix1: '',
        suffix2: '',
        suffix3: '',
        suffix4: ''
      };
    } else if (selectedDisease?.code?.startsWith('MENING_')) {
      return {
        metric1: 'Total Cases',
        metric2: 'Not Available',
        metric3: 'Not Available',
        metric4: 'Countries Affected',
        suffix1: '',
        suffix2: '',
        suffix3: '',
        suffix4: ''
      };
    } else if (selectedDisease?.code?.startsWith('TB_')) {
      return {
        metric1: 'Total Incidence',
        metric2: 'Not Available',
        metric3: 'Not Available',
        metric4: 'Countries Affected',
        suffix1: ' per 100k',
        suffix2: '',
        suffix3: '',
        suffix4: ''
      };
    } else {
      // Default for other WHO diseases (case counts)
      return {
        metric1: 'Total Cases',
        metric2: 'Not Available',
        metric3: 'Not Available',
        metric4: 'Countries Affected',
        suffix1: '',
        suffix2: '',
        suffix3: '',
        suffix4: ''
      };
    }
  };

  const labels = getLabelsForDisease();

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
      }}>
        {selectedDisease?.name || 'Global'} Overview
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem'
      }}>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{labels.metric1}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fbbf24', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {globalData.cases.toLocaleString()}{labels.suffix1}
          </p>
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{labels.metric2}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {globalData.deaths.toLocaleString()}{labels.suffix2}
          </p>
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{labels.metric3}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {globalData.recovered.toLocaleString()}{labels.suffix3}
          </p>
        </div>
        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{labels.metric4}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {globalData.active.toLocaleString()}{labels.suffix4}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobalOverview;