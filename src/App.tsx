import React, { useState } from 'react';
import './App.css';
import { useCovidData } from './hooks/useCovidData';
import GlobalOverview from './components/GlobalOverview';
import CountryDashboard from './components/CountryDashboard';
import GlobeVisualization from './components/GlobeVisualization';
import CountryModal from './components/CountryModal';
import { Country } from './types';

function App() {
  const { globalData, countries, selectedCountry, loading, fetchCountryHistory } = useCovidData();
  const [modalCountry, setModalCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCountryClick = (country: Country) => {
    setModalCountry(country);
    setIsModalOpen(true);
    if (country.countryInfo.iso2) {
      fetchCountryHistory(country.countryInfo.iso2);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCountry(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>COVID-19 Data Visualization</h1>
      </header>
      <main className="container">
        <div className="main-content">
          <GlobeVisualization countries={countries} onCountryClick={handleCountryClick} />
        </div>
        <aside className="sidebar">
          <GlobalOverview globalData={globalData} />
          <CountryDashboard country={selectedCountry} />
        </aside>
      </main>
      <CountryModal 
        country={modalCountry} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </div>
  );
}

export default App;