import axios from 'axios';
import { Disease } from '../components/DiseaseSelector';
import { flagService } from './flagService';

export interface WHOCountryData {
  Id: number;
  IndicatorCode: string;
  SpatialDimType: string;
  SpatialDim: string;
  TimeDimType: string;
  TimeDim: number;
  Dim1Type?: string;
  Dim1?: string;
  Dim2Type?: string;
  Dim2?: string;
  Dim3Type?: string;
  Dim3?: string;
  DataSourceDimType?: string;
  DataSourceDim?: string;
  Value?: number;
  NumericValue?: number;
  Low?: number;
  High?: number;
  Comments?: string;
  Date?: string;
  TimeDimensionValue?: string;
  TimeDimensionBegin?: string;
  TimeDimensionEnd?: string;
}

export interface WHOIndicator {
  IndicatorCode: string;
  IndicatorName: string;
  IndicatorNameShort?: string;
  Language: string;
}

export interface WHOOutbreak {
  id: string;
  title: string;
  description: string;
  country: string;
  date: string;
  disease: string;
  status: string;
}

export interface ProcessedDiseaseData {
  country: string;
  countryCode: string;
  cases: number;
  lat: number;
  lng: number;
  flag: string;
  countryName: string;
}

class WHOApiService {
  private backendBaseURL = 'http://localhost:3002/api/who';

  async getIndicators(): Promise<WHOIndicator[]> {
    try {
      const response = await axios.get(`${this.backendBaseURL}/indicators`);
      return response.data.value || response.data;
    } catch (error) {
      console.error('Error fetching WHO indicators:', error);
      throw error;
    }
  }

  async getDiseaseData(disease: Disease): Promise<WHOCountryData[]> {
    try {
      if (disease.source === 'who-gho') {
        // For WHO GHO API via backend proxy
        const response = await axios.get(`${this.backendBaseURL}/data/${disease.code}`);
        return response.data.value || response.data || [];
      } else if (disease.source === 'who-outbreaks') {
        // For WHO Outbreaks API via backend proxy
        const response = await axios.get(`${this.backendBaseURL}/outbreaks`);
        return response.data.value || response.data || [];
      }
      return [];
    } catch (error) {
      console.error(`Error fetching data for ${disease.name}:`, error);
      return [];
    }
  }

  async getCountryDimensions(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.backendBaseURL}/countries`);
      return response.data.value || response.data || [];
    } catch (error) {
      console.error('Error fetching country dimensions:', error);
      return [];
    }
  }

  // Method to get country coordinates (fallback data)
  private getCountryCoordinates(countryCode: string): { lat: number; lng: number } {
    const coordinates: { [key: string]: { lat: number; lng: number } } = {
      'AFG': { lat: 33.93911, lng: 67.709953 },
      'ALB': { lat: 41.153332, lng: 20.168331 },
      'DZA': { lat: 28.033886, lng: 1.659626 },
      'AND': { lat: 42.506285, lng: 1.521801 },
      'AGO': { lat: -11.202692, lng: 17.873887 },
      'ATG': { lat: 17.060816, lng: -61.796428 },
      'ARG': { lat: -38.416097, lng: -63.616672 },
      'ARM': { lat: 40.069099, lng: 45.038189 },
      'AUS': { lat: -25.274398, lng: 133.775136 },
      'AUT': { lat: 47.516231, lng: 14.550072 },
      'AZE': { lat: 40.143105, lng: 47.576927 },
      'BHS': { lat: 25.03428, lng: -77.39628 },
      'BHR': { lat: 25.930414, lng: 50.637772 },
      'BGD': { lat: 23.684994, lng: 90.356331 },
      'BRB': { lat: 13.193887, lng: -59.543198 },
      'BLR': { lat: 53.709807, lng: 27.953389 },
      'BEL': { lat: 50.503887, lng: 4.469936 },
      'BLZ': { lat: 17.189877, lng: -88.49765 },
      'BEN': { lat: 9.30769, lng: 2.315834 },
      'BTN': { lat: 27.514162, lng: 90.433601 },
      'BOL': { lat: -16.290154, lng: -63.588653 },
      'BIH': { lat: 43.915886, lng: 17.679076 },
      'BWA': { lat: -22.328474, lng: 24.684866 },
      'BRA': { lat: -14.235004, lng: -51.92528 },
      'BRN': { lat: 4.535277, lng: 114.727669 },
      'BGR': { lat: 42.733883, lng: 25.48583 },
      'BFA': { lat: 12.238333, lng: -1.561593 },
      'BDI': { lat: -3.373056, lng: 29.918886 },
      'CPV': { lat: 16.002082, lng: -24.013197 },
      'KHM': { lat: 12.565679, lng: 104.990963 },
      'CMR': { lat: 7.369722, lng: 12.354722 },
      'CAN': { lat: 56.130366, lng: -106.346771 },
      'CAF': { lat: 6.611111, lng: 20.939444 },
      'TCD': { lat: 15.454166, lng: 18.732207 },
      'CHL': { lat: -35.675147, lng: -71.542969 },
      'CHN': { lat: 35.86166, lng: 104.195397 },
      'COL': { lat: 4.570868, lng: -74.297333 },
      'COM': { lat: -11.875001, lng: 43.872219 },
      'COG': { lat: -0.228021, lng: 15.827659 },
      'COD': { lat: -4.038333, lng: 21.758664 },
      'CRI': { lat: 9.748917, lng: -83.753428 },
      'CIV': { lat: 7.539989, lng: -5.54708 },
      'HRV': { lat: 45.1, lng: 15.2 },
      'CUB': { lat: 21.521757, lng: -77.781167 },
      'CYP': { lat: 35.126413, lng: 33.429859 },
      'CZE': { lat: 49.817492, lng: 15.472962 },
      'DNK': { lat: 56.26392, lng: 9.501785 },
      'DJI': { lat: 11.825138, lng: 42.590275 },
      'DMA': { lat: 15.414999, lng: -61.370976 },
      'DOM': { lat: 18.735693, lng: -70.162651 },
      'ECU': { lat: -1.831239, lng: -78.183406 },
      'EGY': { lat: 26.820553, lng: 30.802498 },
      'SLV': { lat: 13.794185, lng: -88.89653 },
      'GNQ': { lat: 1.650801, lng: 10.267895 },
      'ERI': { lat: 15.179384, lng: 39.782334 },
      'EST': { lat: 58.595272, lng: 25.013607 },
      'SWZ': { lat: -26.522503, lng: 31.465866 },
      'ETH': { lat: 9.145, lng: 40.489673 },
      'FJI': { lat: -16.578193, lng: 179.414413 },
      'FIN': { lat: 61.92411, lng: 25.748151 },
      'FRA': { lat: 46.227638, lng: 2.213749 },
      'GAB': { lat: -0.803689, lng: 11.609444 },
      'GMB': { lat: 13.443182, lng: -15.310139 },
      'GEO': { lat: 42.315407, lng: 43.356892 },
      'DEU': { lat: 51.165691, lng: 10.451526 },
      'GHA': { lat: 7.946527, lng: -1.023194 },
      'GRC': { lat: 39.074208, lng: 21.824312 },
      'GRD': { lat: 12.262776, lng: -61.604171 },
      'GTM': { lat: 15.783471, lng: -90.230759 },
      'GIN': { lat: 9.945587, lng: -9.696645 },
      'GNB': { lat: 11.803749, lng: -15.180413 },
      'GUY': { lat: 4.860416, lng: -58.93018 },
      'HTI': { lat: 18.971187, lng: -72.285215 },
      'VAT': { lat: 41.902916, lng: 12.453389 },
      'HND': { lat: 15.199999, lng: -86.241905 },
      'HUN': { lat: 47.162494, lng: 19.503304 },
      'ISL': { lat: 64.963051, lng: -19.020835 },
      'IND': { lat: 20.593684, lng: 78.96288 },
      'IDN': { lat: -0.789275, lng: 113.921327 },
      'IRN': { lat: 32.427908, lng: 53.688046 },
      'IRQ': { lat: 33.223191, lng: 43.679291 },
      'IRL': { lat: 53.41291, lng: -8.24389 },
      'ISR': { lat: 31.046051, lng: 34.851612 },
      'ITA': { lat: 41.87194, lng: 12.56738 },
      'JAM': { lat: 18.109581, lng: -77.297508 },
      'JPN': { lat: 36.204824, lng: 138.252924 },
      'JOR': { lat: 30.585164, lng: 36.238414 },
      'KAZ': { lat: 48.019573, lng: 66.923684 },
      'KEN': { lat: -0.023559, lng: 37.906193 },
      'KIR': { lat: -3.370417, lng: -168.734039 },
      'PRK': { lat: 40.339852, lng: 127.510093 },
      'KOR': { lat: 35.907757, lng: 127.766922 },
      'KWT': { lat: 29.31166, lng: 47.481766 },
      'KGZ': { lat: 41.20438, lng: 74.766098 },
      'LAO': { lat: 19.85627, lng: 102.495496 },
      'LVA': { lat: 56.879635, lng: 24.603189 },
      'LBN': { lat: 33.854721, lng: 35.862285 },
      'LSO': { lat: -29.609988, lng: 28.233608 },
      'LBR': { lat: 6.428055, lng: -9.429499 },
      'LBY': { lat: 26.3351, lng: 17.228331 },
      'LIE': { lat: 47.166, lng: 9.555373 },
      'LTU': { lat: 55.169438, lng: 23.881275 },
      'LUX': { lat: 49.815273, lng: 6.129583 },
      'MDG': { lat: -18.766947, lng: 46.869107 },
      'MWI': { lat: -13.254308, lng: 34.301525 },
      'MYS': { lat: 4.210484, lng: 101.975766 },
      'MDV': { lat: 3.202778, lng: 73.22068 },
      'MLI': { lat: 17.570692, lng: -3.996166 },
      'MLT': { lat: 35.937496, lng: 14.375416 },
      'MHL': { lat: 7.131474, lng: 171.184478 },
      'MRT': { lat: 21.00789, lng: -10.940835 },
      'MUS': { lat: -20.348404, lng: 57.552152 },
      'MEX': { lat: 23.634501, lng: -102.552784 },
      'FSM': { lat: 7.425554, lng: 150.550812 },
      'MDA': { lat: 47.411631, lng: 28.369885 },
      'MCO': { lat: 43.750298, lng: 7.412841 },
      'MNG': { lat: 46.862496, lng: 103.846656 },
      'MNE': { lat: 42.708678, lng: 19.37439 },
      'MAR': { lat: 31.791702, lng: -7.09262 },
      'MOZ': { lat: -18.665695, lng: 35.529562 },
      'MMR': { lat: 21.913965, lng: 95.956223 },
      'NAM': { lat: -22.95764, lng: 18.49041 },
      'NRU': { lat: -0.522778, lng: 166.931503 },
      'NPL': { lat: 28.394857, lng: 84.124008 },
      'NLD': { lat: 52.132633, lng: 5.291266 },
      'NZL': { lat: -40.900557, lng: 174.885971 },
      'NIC': { lat: 12.865416, lng: -85.207229 },
      'NER': { lat: 17.607789, lng: 8.081666 },
      'NGA': { lat: 9.081999, lng: 8.675277 },
      'MKD': { lat: 41.608635, lng: 21.745275 },
      'NOR': { lat: 60.472024, lng: 8.468946 },
      'OMN': { lat: 21.512583, lng: 55.923255 },
      'PAK': { lat: 30.375321, lng: 69.345116 },
      'PLW': { lat: 7.51498, lng: 134.58252 },
      'PSE': { lat: 31.952162, lng: 35.233154 },
      'PAN': { lat: 8.537981, lng: -80.782127 },
      'PNG': { lat: -6.314993, lng: 143.95555 },
      'PRY': { lat: -23.442503, lng: -58.443832 },
      'PER': { lat: -9.189967, lng: -75.015152 },
      'PHL': { lat: 12.879721, lng: 121.774017 },
      'POL': { lat: 51.919438, lng: 19.145136 },
      'PRT': { lat: 39.399872, lng: -8.224454 },
      'QAT': { lat: 25.354826, lng: 51.183884 },
      'ROU': { lat: 45.943161, lng: 24.96676 },
      'RUS': { lat: 61.52401, lng: 105.318756 },
      'RWA': { lat: -1.940278, lng: 29.873888 },
      'KNA': { lat: 17.357822, lng: -62.782998 },
      'LCA': { lat: 13.909444, lng: -60.978893 },
      'VCT': { lat: 12.984305, lng: -61.287228 },
      'WSM': { lat: -13.759029, lng: -172.104629 },
      'SMR': { lat: 43.94236, lng: 12.457777 },
      'STP': { lat: 0.18636, lng: 6.613081 },
      'SAU': { lat: 23.885942, lng: 45.079162 },
      'SEN': { lat: 14.497401, lng: -14.452362 },
      'SRB': { lat: 44.016521, lng: 21.005859 },
      'SYC': { lat: -4.679574, lng: 55.491977 },
      'SLE': { lat: 8.460555, lng: -11.779889 },
      'SGP': { lat: 1.352083, lng: 103.819836 },
      'SVK': { lat: 48.669026, lng: 19.699024 },
      'SVN': { lat: 46.151241, lng: 14.995463 },
      'SLB': { lat: -9.64571, lng: 160.156194 },
      'SOM': { lat: 5.152149, lng: 46.199616 },
      'ZAF': { lat: -30.559482, lng: 22.937506 },
      'SSD': { lat: 6.876991, lng: 31.306978 },
      'ESP': { lat: 40.463667, lng: -3.74922 },
      'LKA': { lat: 7.873054, lng: 80.771797 },
      'SDN': { lat: 12.862807, lng: 30.217636 },
      'SUR': { lat: 3.919305, lng: -56.027783 },
      'SWE': { lat: 60.128161, lng: 18.643501 },
      'CHE': { lat: 46.818188, lng: 8.227512 },
      'SYR': { lat: 34.802075, lng: 38.996815 },
      'TJK': { lat: 38.861034, lng: 71.276093 },
      'TZA': { lat: -6.369028, lng: 34.888822 },
      'THA': { lat: 15.870032, lng: 100.992541 },
      'TLS': { lat: -8.874217, lng: 125.727539 },
      'TGO': { lat: 8.619543, lng: 0.824782 },
      'TON': { lat: -21.178986, lng: -175.198242 },
      'TTO': { lat: 10.691803, lng: -61.222503 },
      'TUN': { lat: 33.886917, lng: 9.537499 },
      'TUR': { lat: 38.963745, lng: 35.243322 },
      'TKM': { lat: 38.969719, lng: 59.556278 },
      'TUV': { lat: -7.109535, lng: 177.64933 },
      'UGA': { lat: 1.373333, lng: 32.290275 },
      'UKR': { lat: 48.379433, lng: 31.16558 },
      'ARE': { lat: 23.424076, lng: 53.847818 },
      'GBR': { lat: 55.378051, lng: -3.435973 },
      'USA': { lat: 37.09024, lng: -95.712891 },
      'URY': { lat: -32.522779, lng: -55.765835 },
      'UZB': { lat: 41.377491, lng: 64.585262 },
      'VUT': { lat: -15.376706, lng: 166.959158 },
      'VEN': { lat: 6.42375, lng: -66.58973 },
      'VNM': { lat: 14.058324, lng: 108.277199 },
      'YEM': { lat: 15.552727, lng: 48.516388 },
      'ZMB': { lat: -13.133897, lng: 27.849332 },
      'ZWE': { lat: -19.015438, lng: 29.154857 }
    };

    return coordinates[countryCode] || { lat: 0, lng: 0 };
  }

  async processWHOData(rawData: WHOCountryData[]): Promise<ProcessedDiseaseData[]> {
    const processedData: ProcessedDiseaseData[] = [];

    // Group data by country - only include COUNTRY data, not regions or global
    const countryMap = new Map<string, WHOCountryData[]>();
    
    rawData.forEach(item => {
      if (item.SpatialDim && 
          item.SpatialDimType === 'COUNTRY' && // Only include country-level data
          item.NumericValue !== undefined && 
          item.NumericValue !== null) {
        const countryCode = item.SpatialDim;
        if (!countryMap.has(countryCode)) {
          countryMap.set(countryCode, []);
        }
        countryMap.get(countryCode)!.push(item);
      }
    });

    // Pre-initialize flag service for faster lookups
    await flagService.initialize();

    // Process countries in batches for better performance
    const countryEntries = Array.from(countryMap.entries());
    const batchSize = 50; // Process 50 countries at a time

    for (let i = 0; i < countryEntries.length; i += batchSize) {
      const batch = countryEntries.slice(i, i + batchSize);
      const batchPromises = batch.map(async ([countryCode, countryData]) => {
        // Get the most recent data point
        const sortedData = countryData.sort((a, b) => (b.TimeDim || 0) - (a.TimeDim || 0));
        const latestData = sortedData[0];

        // Include all valid numeric values, including 0 for coverage data
        if (latestData.NumericValue !== undefined && latestData.NumericValue >= 0) {
          const coordinates = this.getCountryCoordinates(countryCode);
          
          // Batch flag and name lookups for efficiency
          const [flag, countryName] = await Promise.all([
            flagService.getFlagByCode(countryCode),
            flagService.getCountryNameByCode(countryCode)
          ]);
          
          return {
            country: countryName, // Use proper country name instead of code
            countryCode: countryCode,
            cases: latestData.NumericValue,
            lat: coordinates.lat,
            lng: coordinates.lng,
            flag: flag,
            countryName: countryName
          };
        }
        return null;
      });

      const batchResults = await Promise.all(batchPromises);
      processedData.push(...batchResults.filter(result => result !== null) as ProcessedDiseaseData[]);
    }

    return processedData;
  }
}

export const whoApiService = new WHOApiService();