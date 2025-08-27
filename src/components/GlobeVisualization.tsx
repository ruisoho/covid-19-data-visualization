import React, { useState, useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import { Country } from '../types';

interface GlobeVisualizationProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
}

const GlobeVisualization: React.FC<GlobeVisualizationProps> = ({ countries, onCountryClick }) => {
  const globeEl = useRef<any>();
  const containerRef = useRef<HTMLDivElement>(null);
  const [globeWidth, setGlobeWidth] = useState(800);
  const [globeHeight, setGlobeHeight] = useState(600);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setGlobeWidth(rect.width);
        setGlobeHeight(rect.height);
      }
    };
    
    const handleResize = () => {
      updateDimensions();
    };

    window.addEventListener('resize', handleResize);
    
    // Initial dimension update
    updateDimensions();

    if (globeEl.current) {
      globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'pointer' }}>
      <Globe
        ref={globeEl}
        width={globeWidth}
        height={globeHeight}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        pointsData={countries}
        pointLat={(d: any) => d.countryInfo?.lat || 0}
        pointLng={(d: any) => d.countryInfo?.long || 0}
        pointAltitude={(d: any) => {
          const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
          return isCovid ? 0.05 : 0.08; // WHO diseases slightly taller
        }}
        pointRadius={(d: any) => {
          const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
          return isCovid ? 0.3 : 0.5; // WHO diseases larger
        }}
        pointColor={(d: any) => {
          const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
          if (isCovid) {
            // COVID gradient colors based on case severity
            const cases = d.cases || 0;
            if (cases > 10000000) return '#7c2d12'; // Very dark red
            if (cases > 1000000) return '#dc2626'; // Red
            if (cases > 100000) return '#ea580c'; // Orange-red
            if (cases > 10000) return '#f59e0b'; // Orange
            return '#22c55e'; // Green for low cases
          } else {
            // WHO diseases - blue gradient
            const cases = d.cases || 0;
            if (cases > 1000) return '#1e3a8a'; // Dark blue
            if (cases > 100) return '#3b82f6'; // Blue
            if (cases > 50) return '#60a5fa'; // Light blue
            return '#93c5fd'; // Very light blue
          }
        }}
        pointLabel={(d: any) => {
          const country = d.country || 'Unknown';
          const cases = d.cases || 0;
          const flag = d.countryInfo?.flag || '';
          const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
          
          return `<div style="
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            min-width: 200px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #f1f5f9;
            backdrop-filter: blur(10px);
          ">
            <div style="
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              padding-bottom: 12px;
            ">
              ${flag ? `<img src="${flag}" alt="${country}" style="width: 32px; height: 24px; border-radius: 4px; object-fit: cover; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);" />` : '🌍'}
              <div>
                <div style="font-weight: 600; font-size: 16px; color: #f8fafc; margin-bottom: 2px;">${country}</div>
                <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">${isCovid ? 'COVID-19 Data' : 'Disease Data'}</div>
              </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(59, 130, 246, 0.1);
                padding: 8px 12px;
                border-radius: 6px;
                border-left: 3px solid #3b82f6;
              ">
                <span style="font-size: 14px; color: #e2e8f0;">📊 ${isCovid ? 'Total Cases' : 'Value'}</span>
                <span style="font-weight: 600; font-size: 16px; color: #60a5fa;">${cases.toLocaleString()}</span>
              </div>
              
              ${isCovid && d.deaths ? `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background: rgba(239, 68, 68, 0.1);
                  padding: 8px 12px;
                  border-radius: 6px;
                  border-left: 3px solid #ef4444;
                ">
                  <span style="font-size: 14px; color: #e2e8f0;">💀 Deaths</span>
                  <span style="font-weight: 600; font-size: 16px; color: #f87171;">${d.deaths.toLocaleString()}</span>
                </div>
              ` : ''}
              
              ${isCovid && d.recovered ? `
                <div style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background: rgba(34, 197, 94, 0.1);
                  padding: 8px 12px;
                  border-radius: 6px;
                  border-left: 3px solid #22c55e;
                ">
                  <span style="font-size: 14px; color: #e2e8f0;">✅ Recovered</span>
                  <span style="font-weight: 600; font-size: 16px; color: #4ade80;">${d.recovered.toLocaleString()}</span>
                </div>
              ` : ''}
            </div>
            
            <div style="
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              text-align: center;
            ">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">💡 Click for detailed information</div>
            </div>
          </div>`;
        }}
        onPointClick={onCountryClick}
      />
    </div>
  );
};

export default GlobeVisualization;