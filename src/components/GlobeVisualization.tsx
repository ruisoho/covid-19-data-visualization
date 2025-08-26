import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Country } from '../types';

interface GlobeVisualizationProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({ countries, onCountryClick }) => {
  const globeEl = useRef<any>();
  const [globeWidth, setGlobeWidth] = useState(window.innerWidth);
  const [globeHeight, setGlobeHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setGlobeWidth(window.innerWidth);
      setGlobeHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Globe<Country>
      ref={globeEl}
      width={globeWidth}
      height={globeHeight}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
      pointsData={countries}
      pointLat={(d) => {
        if (!d.countryInfo || typeof d.countryInfo.lat === 'undefined') {
          console.error('Invalid country data for latitude:', d);
          return 0;
        }
        return d.countryInfo.lat;
      }}
      pointLng={(d) => {
        if (!d.countryInfo || typeof d.countryInfo.long === 'undefined') {
          console.error('Invalid country data for longitude:', d);
          return 0;
        }
        return d.countryInfo.long;
      }}
      pointAltitude={(d) => {
        return Math.max(0.2, Math.sqrt(d.cases) / 30);
      }}
      pointRadius={(d) => {
        return Math.max(0.3, Math.sqrt(d.cases) / 200);
      }}
      pointColor={(d) => {
        const intensity = Math.min(d.cases / 1000000, 1);
        return `rgba(239, 68, 68, ${0.6 + intensity * 0.4})`;
      }}
      pointLabel={(d) => {
        return `
          <div style="
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px;
            border-radius: 8px;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            max-width: 200px;
          ">
            <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px; color: #fca5a5;">${d.country}</div>
            <div style="font-size: 12px; margin-bottom: 4px;">📊 Cases: <span style="color: #fbbf24;">${d.cases.toLocaleString()}</span></div>
            <div style="font-size: 12px; margin-bottom: 4px;">💀 Deaths: <span style="color: #ef4444;">${d.deaths.toLocaleString()}</span></div>
            <div style="font-size: 12px; margin-bottom: 4px;">✅ Recovered: <span style="color: #10b981;">${d.recovered.toLocaleString()}</span></div>
            <div style="font-size: 10px; color: #9ca3af; margin-top: 8px; text-align: center;">Click for details</div>
          </div>
        `;
      }}
      onPointClick={(d) => {
        onCountryClick(d);
      }}
    />
  );
};

export default GlobeVisualization;