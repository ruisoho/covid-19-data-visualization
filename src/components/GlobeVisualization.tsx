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
        pointAltitude={0.1}
        pointRadius={0.5}
        pointColor={() => '#ff6b6b'}
        pointLabel={(d: any) => d.country}
        onPointClick={onCountryClick}
      />
    </div>
  );
};

export default GlobeVisualization;