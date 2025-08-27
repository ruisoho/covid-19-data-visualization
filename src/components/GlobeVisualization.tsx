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
        pointsMerge={true}
        pointResolution={8}
        enablePointerInteraction={true}
      pointLat={(d: any) => {
        if (!d.countryInfo || typeof d.countryInfo.lat === 'undefined') {
          console.error('Invalid country data for latitude:', d);
          return 0;
        }
        return d.countryInfo.lat;
      }}
      pointLng={(d: any) => {
        if (!d.countryInfo || typeof d.countryInfo.long === 'undefined') {
          console.error('Invalid country data for longitude:', d);
          return 0;
        }
        return d.countryInfo.long;
      }}
      pointAltitude={(d: any) => {
        // Determine if this is COVID data
        const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
        
        if (isCovid) {
          // COVID data altitude - doubled
          return Math.max(0.02, Math.sqrt(d.cases) / 500000);
        } else if (d.cases <= 100) {
          // For percentage data (like HIV coverage) - doubled
          return Math.max(0.08, Math.sqrt(d.cases) / 50);
        } else {
          // For disease case counts (like meningitis) - doubled
          return Math.max(0.08, Math.sqrt(d.cases) / 500);
        }
      }}
      pointRadius={(d: any) => {
        // Determine if this is COVID data
        const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
        
        if (isCovid) {
          // COVID data radius - doubled
          return Math.max(0.2, Math.sqrt(d.cases) / 3000);
        } else if (d.cases <= 100) {
          // For percentage data (like HIV coverage) - doubled
          return Math.max(0.5, Math.sqrt(d.cases) / 8);
        } else {
          // For disease case counts (like meningitis) - doubled
          return Math.max(0.5, Math.sqrt(d.cases) / 25);
        }
      }}
      pointColor={(d: any) => {
        const cases = d.cases;
        
        // Adaptive color scheme based on data range
        if (cases <= 100) {
          // For percentage data (like HIV coverage)
          if (cases < 25) return '#ef4444'; // Red for low coverage
          else if (cases < 50) return '#f97316'; // Orange for medium coverage
          else if (cases < 75) return '#eab308'; // Yellow for good coverage
          else return '#22c55e'; // Green for high coverage
        } else if (cases <= 100000) {
          // For disease case counts (like meningitis)
          if (cases < 100) return '#22c55e'; // Green for low cases
          else if (cases < 1000) return '#eab308'; // Yellow for medium cases
          else if (cases < 10000) return '#f97316'; // Orange for high cases
          else return '#ef4444'; // Red for very high cases
        } else {
          // For large numbers (like COVID) - original logic
          if (cases < 10000) return '#22c55e';
          else if (cases < 100000) return '#eab308';
          else if (cases < 1000000) return '#f97316';
          else if (cases < 5000000) return '#ef4444';
          else return '#991b1b';
        }
      }}
      pointLabel={(d: any) => {
        console.log('Point label for:', d);
        const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
        
        if (isCovid) {
          // COVID data format
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
        } else {
          // WHO data format - simplified to ensure it works
          const countryName = d.country || d.countryName || 'Unknown Country';
          const value = d.cases || 0;
          const countryCode = d.countryInfo?.iso2 || d.countryCode || 'N/A';
          
          return `<div style="background: rgba(0,0,0,0.8); color: white; padding: 10px; border-radius: 6px; font-family: Arial;">
            <b>${countryName}</b><br/>
            Value: ${value.toLocaleString()}<br/>
            Code: ${countryCode}<br/>
            <small>Click for details</small>
          </div>`;
        }
      }}
      onPointClick={(d: any, event: any) => {
        console.log('Globe point clicked:', d, event);
        onCountryClick(d as Country);
      }}
      />
    </div>
  );
};

export default GlobeVisualization;