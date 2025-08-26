# COVID-19 Data Visualization

An interactive 3D globe visualization for COVID-19 data with real-time statistics and country-specific dashboards.

## Features

- **Interactive 3D Globe**: Click on countries to view detailed COVID-19 statistics
- **Real-time Data**: Fetches latest COVID-19 data from reliable APIs
- **Global Overview**: Display worldwide statistics at a glance
- **Country Dashboard**: Detailed view of individual country data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Visualization**: react-globe.gl
- **Data Fetching**: Axios
- **Build Tool**: Vite
- **Backend**: Node.js, Express, TypeScript

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ruisoho/covid-19-data-visualization.git
cd covid-19-data-visualization
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── GlobeVisualization.tsx
│   │   ├── GlobalOverview.tsx
│   │   ├── CountryDashboard.tsx
│   │   └── CountryModal.tsx
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── backend/                # Backend server
│   ├── server.ts           # Express server
│   └── package.json        # Backend dependencies
└── public/                 # Static assets
```

## API Endpoints

The application uses the following data sources:
- Primary: Local backend server (fallback to external APIs)
- Fallback: disease.sh API for COVID-19 data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- COVID-19 data provided by disease.sh
- 3D globe visualization powered by react-globe.gl
- UI components styled with Tailwind CSS
