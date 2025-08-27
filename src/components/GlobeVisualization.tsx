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
        showGlobe={true}
        showAtmosphere={true}
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
        console.log('Tooltip called for:', d);
        const country = d.country || 'Unknown Country';
        const cases = d.cases || 0;
        const isCovid = d.countryInfo && d.countryInfo.iso2 && d.continent;
        
        if (isCovid) {
          return `${country}<br/>Cases: ${cases.toLocaleString()}<br/>Deaths: ${d.deaths.toLocaleString()}<br/>Click for details`;
        } else {
          return `${country}<br/>Value: ${cases.toLocaleString()}<br/>Click for details`;
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