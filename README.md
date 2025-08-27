# 🌍 World Disease Tracker

An advanced interactive 3D globe visualization platform for tracking multiple global diseases with real-time statistics, country-specific dashboards, and comprehensive health data integration.

##Live Demo:
https://world-diseases-tracker.vercel.app/

## ✨ Features

### 🦠 **Multi-Disease Support**
- **COVID-19**: Complete pandemic statistics with historical data
- **HIV/AIDS**: Treatment coverage and estimated patient numbers
- **Tuberculosis**: Global TB incidence and case tracking
- **Meningitis**: Suspected case monitoring across regions
- **Measles**: Vaccination coverage and outbreak tracking

### 🌐 **Interactive 3D Globe**
- Click on countries to view detailed disease statistics
- Adaptive point sizing based on data ranges (percentages vs. case counts)
- Color-coded visualization reflecting disease severity/coverage
- Smooth animations and responsive interactions

### 📊 **Comprehensive Analytics**
- **Global Overview**: Worldwide statistics and disease metrics
- **Country Dashboards**: Detailed view of individual country data
- **Comparison Tools**: Side-by-side country analysis
- **Historical Data**: COVID-19 trend analysis with charts

### 🎨 **Modern UI/UX**
- **Left Sidebar**: Disease selector with modern glass morphism design
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Live Statistics**: Real-time header stats display
- **Welcome Screen**: Engaging onboarding experience
- **Modal System**: Layered information without UI conflicts

### 🚀 **Performance Optimizations**
- **Batch Processing**: WHO data processed in chunks of 50 countries
- **Flag Caching**: Pre-loaded country flags and names
- **Parallel API Calls**: Concurrent data fetching for better speed
- **Request Timeouts**: 5-second timeouts prevent hanging requests

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and building
- **react-globe.gl** for 3D globe visualization
- **Axios** for HTTP requests with error handling
- **CSS3** with modern features (gradients, backdrop-filter, flexbox/grid)

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for server-side type safety
- **CORS** configured for multiple port support
- **Axios** for external API integration
- **Request logging** middleware for debugging

### APIs & Data Sources
- **COVID-19**: disease.sh API for comprehensive pandemic data
- **WHO Global Health Observatory (GHO)**: Official health statistics
- **Flag Service**: Standardized country flags and names
- **Backend Proxy**: CORS-compliant data routing

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern browser with WebGL support

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/global-disease-tracker.git
cd global-disease-tracker
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Install backend dependencies:**
```bash
cd backend
npm install
cd ..
```

### Running the Application

1. **Start the backend server:**
```bash
cd backend
npm run dev
```
*Backend will run on `http://localhost:3002`*

2. **In a new terminal, start the frontend:**
```bash
npm run dev
```
*Frontend will run on `http://localhost:5173` or `http://localhost:5175`*

3. **Open your browser and navigate to the frontend URL**

## 📁 Project Structure

```
├── src/
│   ├── components/              # React components
│   │   ├── GlobeVisualization.tsx    # 3D globe with adaptive visualization
│   │   ├── GlobalOverview.tsx        # Disease-specific global metrics
│   │   ├── CountryDashboard.tsx      # Individual country details
│   │   ├── CountryModal.tsx          # Country information modal
│   │   ├── CountryComparison.tsx     # Multi-country analysis
│   │   ├── ComparisonModal.tsx       # Comparison interface
│   │   └── DiseaseSelector.tsx       # Disease selection sidebar
│   ├── hooks/                   # Custom React hooks
│   │   └── useCovidData.ts      # COVID-19 data management
│   ├── services/                # API services
│   │   ├── covidApi.ts          # COVID-19 API integration
│   │   ├── whoApi.ts            # WHO health data service
│   │   └── flagService.ts       # Country standardization
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # Shared interfaces
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Modern styling with animations
│   └── index.css                # Global styles
├── backend/                     # Backend server
│   ├── server.ts                # Express server with CORS
│   └── package.json             # Backend dependencies
└── public/                      # Static assets
```

## 🔗 API Integration

### Data Sources
- **Primary**: Local backend server with proxy endpoints
- **COVID-19**: `https://disease.sh/v3/covid-19/`
- **WHO GHO**: `https://ghoapi.azureedge.net/api/`
- **Country Flags**: Cached from disease.sh assets

### Backend Endpoints
```
GET /api/global                    # COVID-19 global statistics
GET /api/countries                 # All countries COVID-19 data
GET /api/historical/:country       # Country historical data
GET /api/who/data/:indicatorCode   # WHO health indicator data
GET /api/who/indicators           # Available WHO indicators
GET /api/who/countries            # WHO country dimensions
```

## 🎯 Key Improvements Made

### 🔄 **Data Processing Enhancements**
- Converted HIV coverage percentages to estimated treatment numbers
- Implemented disease-specific data aggregation strategies
- Added robust error handling and fallback mechanisms
- Optimized WHO API data processing with batch operations

### 🎨 **UI/UX Redesign**
- Complete visual overhaul with modern gradient backgrounds
- Repositioned disease selector to dedicated left sidebar
- Implemented responsive mobile design with toggle navigation
- Added smooth animations and loading states
- Fixed modal layering issues for better user experience

### ⚡ **Performance Optimizations**
- Batch processing of country data (50 countries per batch)
- Implemented flag service caching system
- Parallel API calls for faster data loading
- Added request timeouts and connection pooling

### 🔧 **Technical Improvements**
- Fixed CORS configuration for multiple port support
- Resolved React key conflicts in components
- Centered globe visualization for better visual balance
- Enhanced error handling throughout the application

## 📱 Responsive Design

- **Desktop**: Full sidebar + centered globe + right panels layout
- **Tablet**: Adaptive sidebar positioning with responsive panels
- **Mobile**: Collapsible sidebar with toggle button navigation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **COVID-19 data** provided by [disease.sh](https://disease.sh/)
- **Global health data** from [WHO Global Health Observatory](https://www.who.int/gho)
- **3D globe visualization** powered by [react-globe.gl](https://github.com/vasturiano/react-globe.gl)
- **Country flags** from disease.sh assets
- **Built with assistance from Claude Code** 🤖

## 📊 Disease Data Sources

| Disease | Source | Data Type | Update Frequency |
|---------|--------|-----------|-----------------|
| COVID-19 | disease.sh | Cases, Deaths, Recovered | Daily |
| HIV/AIDS | WHO GHO | Treatment Coverage → Est. Numbers | Annual |
| Tuberculosis | WHO GHO | Incidence Cases | Annual |
| Meningitis | WHO GHO | Suspected Cases | Annual |
| Measles | WHO GHO | Vaccination Coverage | Annual |

---

**🌍 Explore global health data like never before with interactive 3D visualization!**
