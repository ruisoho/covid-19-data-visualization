import { useState, useEffect } from 'react';
import './App.css';
import { useCovidData } from './hooks/useCovidData';
import GlobalOverview from './components/GlobalOverview';
import CountryDashboard from './components/CountryDashboard';
import GlobeVisualization from './components/GlobeVisualization';
import CountryModal from './components/CountryModal';
import CountryComparison from './components/CountryComparison';
import ComparisonModal from './components/ComparisonModal';
import DiseaseSelector, { Disease } from './components/DiseaseSelector';
import { Country } from './types';
import { whoApiService } from './services/whoApi';
import { flagService } from './services/flagService';

function App() {
  const { globalData: covidGlobalData, countries: covidCountries, selectedCountry: covidSelectedCountry, loading: covidLoading, fetchCountryHistory } = useCovidData();
  const [modalCountry, setModalCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [selectedCountriesForComparison, setSelectedCountriesForComparison] = useState<string[]>([]);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [diseaseData, setDiseaseData] = useState<{
    globalData: any;
    countries: Country[];
    selectedCountry: Country | null;
    loading: boolean;
  }>({
    globalData: null,
    countries: [],
    selectedCountry: null,
    loading: false
  });

  // Initialize flag service on app start
  useEffect(() => {
    flagService.initialize().catch(console.error);
  }, []);

  const handleCountryClick = (country: Country) => {
    console.log('Country clicked:', country);
    setModalCountry(country);
    setIsModalOpen(true);
    
    // Try to get country code for history fetching (works for COVID data)
    if (selectedDisease?.source === 'covid' && country.countryInfo?.iso2) {
      fetchCountryHistory(country.countryInfo.iso2);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalCountry(null);
  };

  const handleOpenComparison = (selectedCountries: string[]) => {
    setSelectedCountriesForComparison(selectedCountries);
    setComparisonModalOpen(true);
  };

  const closeComparisonModal = () => {
    setComparisonModalOpen(false);
    setSelectedCountriesForComparison([]);
  };

  const handleDiseaseSelect = async (disease: Disease) => {
    setSelectedDisease(disease);
    setDiseaseData(prev => ({ ...prev, loading: true }));

    if (disease.source === 'covid') {
      // Use existing COVID data
      setDiseaseData({
        globalData: covidGlobalData,
        countries: covidCountries,
        selectedCountry: covidSelectedCountry,
        loading: covidLoading
      });
    } else {
      try {
        // Fetch WHO data with optimized processing
        const whoRawData = await whoApiService.getDiseaseData(disease);
        const processedData = await whoApiService.processWHOData(whoRawData);
        
        // Convert WHO data to Country format for globe visualization
        const whoCountries: Country[] = processedData.map(data => ({
          country: data.country,
          cases: data.cases,
          deaths: 0, // WHO data doesn't always include deaths
          recovered: 0, // WHO data doesn't always include recovered
          active: data.cases,
          critical: 0,
          casesPerOneMillion: 0,
          deathsPerOneMillion: 0,
          tests: 0,
          testsPerOneMillion: 0,
          population: 0,
          oneCasePerPeople: 0,
          oneDeathPerPeople: 0,
          oneTestPerPeople: 0,
          activePerOneMillion: 0,
          recoveredPerOneMillion: 0,
          criticalPerOneMillion: 0,
          continent: 'Unknown', // WHO data doesn't include continent info
          countryInfo: {
            _id: 0,
            iso2: data.countryCode,
            iso3: data.countryCode,
            lat: data.lat,
            long: data.lng,
            flag: data.flag
          },
          updated: Date.now()
        }));
        

        // Calculate appropriate global metrics based on disease type
        let globalMetrics;
        const validData = processedData.filter(data => data.cases >= 0);
        
        if (disease.code === 'HIV_ARTCOVERAGE') {
          // For HIV coverage data, estimate treatment numbers based on coverage percentages
          // Using rough estimation: each 1% coverage represents ~10,000 people in treatment globally
          const estimatedTreatmentNumbers = validData.map(data => ({
            ...data,
            estimatedTreatment: Math.round(data.cases * 1000) // Convert % to estimated numbers
          }));
          
          const totalEstimatedTreatment = estimatedTreatmentNumbers.reduce((sum, data) => sum + data.estimatedTreatment, 0);
          const avgTreatmentPerCountry = validData.length > 0 ? Math.round(totalEstimatedTreatment / validData.length) : 0;
          const maxTreatmentCountry = validData.length > 0 ? 
            Math.max(...estimatedTreatmentNumbers.map(data => data.estimatedTreatment)) : 0;
            
          globalMetrics = {
            cases: totalEstimatedTreatment, // Total estimated people in treatment
            deaths: maxTreatmentCountry, // Highest treatment numbers in single country
            recovered: avgTreatmentPerCountry, // Average treatment per country
            active: totalEstimatedTreatment, // Same as total cases
            critical: 0,
            casesPerOneMillion: 0,
            deathsPerOneMillion: 0,
            tests: 0,
            testsPerOneMillion: 0,
            population: 0,
            oneCasePerPeople: 0,
            oneDeathPerPeople: 0,
            oneTestPerPeople: 0,
            activePerOneMillion: 0,
            recoveredPerOneMillion: 0,
            criticalPerOneMillion: 0,
            updated: Date.now(),
            affectedCountries: validData.length
          };
        } else if (disease.code.startsWith('MENING_') || disease.code.startsWith('TB_') || 
                   disease.code.startsWith('WHS4_') || disease.code.startsWith('MALARIA')) {
          // For case count data, sum the totals
          const totalCases = validData.reduce((sum, data) => sum + data.cases, 0);
          
          globalMetrics = {
            cases: totalCases,
            deaths: 0,
            recovered: 0,
            active: totalCases,
            critical: 0,
            casesPerOneMillion: 0,
            deathsPerOneMillion: 0,
            tests: 0,
            testsPerOneMillion: 0,
            population: 0,
            oneCasePerPeople: 0,
            oneDeathPerPeople: 0,
            oneTestPerPeople: 0,
            activePerOneMillion: 0,
            recoveredPerOneMillion: 0,
            criticalPerOneMillion: 0,
            updated: Date.now(),
            affectedCountries: validData.length
          };
        } else {
          // Default handling for other data types
          globalMetrics = {
            cases: validData.reduce((sum, data) => sum + data.cases, 0),
            deaths: 0,
            recovered: 0,
            active: validData.reduce((sum, data) => sum + data.cases, 0),
            critical: 0,
            casesPerOneMillion: 0,
            deathsPerOneMillion: 0,
            tests: 0,
            testsPerOneMillion: 0,
            population: 0,
            oneCasePerPeople: 0,
            oneDeathPerPeople: 0,
            oneTestPerPeople: 0,
            activePerOneMillion: 0,
            recoveredPerOneMillion: 0,
            criticalPerOneMillion: 0,
            updated: Date.now(),
            affectedCountries: validData.length
          };
        }


        setDiseaseData({
          globalData: globalMetrics,
          countries: whoCountries,
          selectedCountry: null,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching disease data:', error);
        setDiseaseData({
          globalData: null,
          countries: [],
          selectedCountry: null,
          loading: false
        });
      }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const currentData = selectedDisease ? diseaseData : {
    globalData: covidGlobalData,
    countries: covidCountries,
    loading: covidLoading
  };


  return (
    <div className="app">
      {/* Modern Header */}
      <header className={`app-header ${(isModalOpen || comparisonModalOpen) ? 'dimmed' : ''}`}>
        <h1 className="app-title">
          🌍 Global Disease Tracker
        </h1>
        
        {selectedDisease && currentData.globalData && (
          <div className="header-stats fade-in">
            <div className="stat-item">
              <div className="stat-value">
                {currentData.globalData.cases.toLocaleString()}
              </div>
              <div className="stat-label">
                {selectedDisease.code === 'HIV_ARTCOVERAGE' ? 'People in Treatment' : 'Total Cases'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{currentData.globalData.affectedCountries}</div>
              <div className="stat-label">Countries</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{selectedDisease.name}</div>
              <div className="stat-label">Disease</div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Disease Selector Sidebar */}
      <div className={`disease-selector-sidebar slide-in-left ${
        (isModalOpen || comparisonModalOpen) ? 'hidden' : ''
      } ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h3 className="sidebar-title">Select Disease to Track</h3>
          <p className="sidebar-subtitle">
            Choose from global health datasets to explore on the interactive globe
          </p>
        </div>
        <div className="sidebar-content">
          <DiseaseSelector 
            onDiseaseSelect={(disease) => {
              handleDiseaseSelect(disease);
              setMobileMenuOpen(false);
            }}
            selectedDisease={selectedDisease}
          />
        </div>
      </div>

      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle disease selector"
      >
        {mobileMenuOpen ? '✕' : '🦠'}
      </button>

      {/* Main Content */}
      <main className="main-container">
        {!selectedDisease ? (
          <div className="welcome-screen fade-in">
            <div className="welcome-icon">🌍</div>
            <h2 className="welcome-title">
              Explore Global Health Data
            </h2>
            <p className="welcome-subtitle">
              Track diseases worldwide with interactive visualizations. Select a disease from the sidebar to begin exploring real-time health data across the globe.
            </p>
            <button 
              className="welcome-cta"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span>🦠</span>
              Get Started
            </button>
          </div>
        ) : currentData.loading ? (
          <div className="loading-spinner fade-in">
            <div className="spinner"></div>
            <p>Loading {selectedDisease.name} data...</p>
          </div>
        ) : (
          <div className="dashboard fade-in">
            <div className="dashboard-main">
              <div className="globe-container">
                <GlobeVisualization 
                  countries={currentData.countries} 
                  onCountryClick={handleCountryClick} 
                />
              </div>
              
              <div className="dashboard-panels slide-in-right">
                <div className="dashboard-panel">
                  <GlobalOverview 
                    globalData={currentData.globalData} 
                    selectedDisease={selectedDisease} 
                  />
                </div>
                
                {diseaseData.selectedCountry && (
                  <div className="dashboard-panel">
                    <CountryDashboard country={diseaseData.selectedCountry} />
                  </div>
                )}
                
                <div className="dashboard-panel">
                  <CountryComparison 
                    countries={currentData.countries} 
                    onOpenComparison={handleOpenComparison} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <CountryModal 
        country={modalCountry} 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
      <ComparisonModal
        isOpen={comparisonModalOpen}
        onClose={closeComparisonModal}
        selectedCountries={selectedCountriesForComparison}
        countries={currentData.countries}
      />
    </div>
  );
}

export default App;