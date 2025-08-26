import React, { useState } from 'react';

export interface Disease {
  id: string;
  name: string;
  code: string;
  description: string;
  source: 'covid' | 'who-gho' | 'who-outbreaks';
  color: string;
  icon: string;
}

interface DiseaseSelectorProps {
  onDiseaseSelect: (disease: Disease) => void;
  selectedDisease?: Disease;
}

const DiseaseSelector: React.FC<DiseaseSelectorProps> = ({ onDiseaseSelect, selectedDisease }) => {
  const [isOpen, setIsOpen] = useState(false);

  const diseases: Disease[] = [
    {
      id: 'covid-19',
      name: 'COVID-19',
      code: 'COVID19',
      description: 'Coronavirus Disease 2019',
      source: 'covid',
      color: '#ef4444',
      icon: '🦠'
    },
    {
      id: 'meningitis',
      name: 'Meningitis',
      code: 'MENING_2',
      description: 'Meningitis suspected cases',
      source: 'who-gho',
      color: '#f59e0b',
      icon: '🧠'
    },
    {
      id: 'hiv',
      name: 'HIV/AIDS',
      code: 'HIV_ARTCOVERAGE',
      description: 'HIV antiretroviral therapy coverage',
      source: 'who-gho',
      color: '#8b5cf6',
      icon: '🎗️'
    },
    {
      id: 'tuberculosis',
      name: 'Tuberculosis',
      code: 'TB_1',
      description: 'Estimated TB incidence',
      source: 'who-gho',
      color: '#10b981',
      icon: '🫁'
    },
    {
      id: 'leptospirosis',
      name: 'Leptospirosis',
      code: 'LEPTO_MORTALITY',
      description: 'Estimated leptospirosis deaths',
      source: 'who-gho',
      color: '#84cc16',
      icon: '🐀'
    },
    {
      id: 'hepatitis',
      name: 'Hepatitis B',
      code: 'WHS4_543',
      description: 'Hepatitis B surface antigen prevalence',
      source: 'who-gho',
      color: '#f97316',
      icon: '🦠'
    },
    {
      id: 'measles',
      name: 'Measles',
      code: 'WHS4_544',
      description: 'Measles vaccination coverage',
      source: 'who-gho',
      color: '#ec4899',
      icon: '🤒'
    }
  ];

  const handleDiseaseSelect = (disease: Disease) => {
    onDiseaseSelect(disease);
    setIsOpen(false);
  };

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      padding: '1rem',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      position: 'relative'
    }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
        color: '#f8fafc'
      }}>
        Select Disease to Track
      </h3>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '0.75rem',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: '#f8fafc',
          cursor: 'pointer',
          fontSize: '0.875rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.125rem' }}>
            {selectedDisease?.icon || '🌍'}
          </span>
          <span style={{ fontWeight: '500' }}>
            {selectedDisease?.name || 'Select a disease...'}
          </span>
        </div>
        <span style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
          fontSize: '0.75rem'
        }}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {diseases.map((disease) => (
            <button
              key={disease.id}
              onClick={() => handleDiseaseSelect(disease)}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                textAlign: 'left',
                border: 'none',
                background: selectedDisease?.id === disease.id 
                  ? 'rgba(59, 130, 246, 0.2)' 
                  : 'transparent',
                color: selectedDisease?.id === disease.id 
                  ? '#93c5fd' 
                  : '#cbd5e1',
                cursor: 'pointer',
                fontSize: '0.875rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onMouseEnter={(e) => {
                if (selectedDisease?.id !== disease.id) {
                  (e.target as HTMLElement).style.background = 'rgba(71, 85, 105, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedDisease?.id !== disease.id) {
                  (e.target as HTMLElement).style.background = 'transparent';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.125rem' }}>{disease.icon}</span>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '0.125rem' }}>
                    {disease.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#94a3b8',
                    marginBottom: '0.25rem'
                  }}>
                    {disease.description}
                  </div>
                  <div style={{ 
                    fontSize: '0.625rem', 
                    color: disease.source === 'covid' ? '#fbbf24' : '#10b981',
                    fontWeight: '500',
                    textTransform: 'uppercase'
                  }}>
                    {disease.source === 'covid' ? 'Disease.sh API' : 'WHO API'}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiseaseSelector;