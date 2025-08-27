import React from 'react';

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
  selectedDisease?: Disease | null;
}

const DiseaseSelector: React.FC<DiseaseSelectorProps> = ({ onDiseaseSelect, selectedDisease }) => {
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
  };

  return (
    <div className="disease-selector-container">
      <div className="disease-list">
        {diseases.map((disease) => (
          <button
            key={disease.id}
            onClick={() => handleDiseaseSelect(disease)}
            className={`disease-item ${selectedDisease?.id === disease.id ? 'selected' : ''}`}
          >
            <div className="disease-content-simple">
              <span className="disease-icon-simple">{disease.icon}</span>
              <span className="disease-name-simple">
                {disease.name}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DiseaseSelector;