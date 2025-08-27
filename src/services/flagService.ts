import axios from 'axios';

interface CountryFlag {
  iso2: string;
  iso3: string;
  flag: string;
  name: string;
}

class FlagService {
  private flagCache: Map<string, string> = new Map();
  private nameCache: Map<string, string> = new Map();
  private countriesCache: CountryFlag[] | null = null;

  // Initialize flag service - call this early in app lifecycle
  async initialize(): Promise<void> {
    if (!this.countriesCache) {
      await this.fetchCountryFlags();
    }
  }

  // Fetch all countries from COVID API to get flag mappings
  async fetchCountryFlags(): Promise<CountryFlag[]> {
    if (this.countriesCache) {
      return this.countriesCache;
    }

    try {
      // Use a more efficient endpoint that only returns country info
      const apiUrl = import.meta.env.PROD ? '/api/countries' : 'http://localhost:3002/api/countries';
      const response = await axios.get(apiUrl, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
        }
      });
      
      this.countriesCache = response.data.map((country: any) => ({
        iso2: country.countryInfo.iso2,
        iso3: country.countryInfo.iso3,
        flag: country.countryInfo.flag,
        name: country.country
      }));

      // Populate cache for quick lookups
      this.countriesCache?.forEach(country => {
        if (country.iso2) {
          this.flagCache.set(country.iso2, country.flag);
          this.nameCache.set(country.iso2, country.name);
        }
        if (country.iso3) {
          this.flagCache.set(country.iso3, country.flag);
          this.nameCache.set(country.iso3, country.name);
        }
      });

      return this.countriesCache || [];
    } catch (error) {
      console.error('Error fetching country flags:', error);
      return [];
    }
  }

  // Get flag URL by country code (ISO2 or ISO3)
  async getFlagByCode(countryCode: string): Promise<string> {
    // Check cache first
    if (this.flagCache.has(countryCode)) {
      return this.flagCache.get(countryCode)!;
    }

    // If not in cache, fetch all flags first
    await this.fetchCountryFlags();

    // Try again from cache
    if (this.flagCache.has(countryCode)) {
      return this.flagCache.get(countryCode)!;
    }

    // Fallback: construct flag URL from disease.sh pattern
    const iso2Code = countryCode.length === 2 ? countryCode.toLowerCase() : this.getISO2FromISO3(countryCode);
    return `https://disease.sh/assets/img/flags/${iso2Code}.png`;
  }

  // Get country name by country code (ISO2 or ISO3)
  async getCountryNameByCode(countryCode: string): Promise<string> {
    // Check cache first
    if (this.nameCache.has(countryCode)) {
      return this.nameCache.get(countryCode)!;
    }

    // If not in cache, fetch all countries first
    await this.fetchCountryFlags();

    // Try again from cache
    if (this.nameCache.has(countryCode)) {
      return this.nameCache.get(countryCode)!;
    }

    // Fallback mapping for WHO-specific codes that might not match COVID API
    const whoToNameMap: { [key: string]: string } = {
      'SDN': 'Sudan',
      'SSD': 'South Sudan',
      'COD': 'Democratic Republic of Congo',
      'COG': 'Republic of Congo',
      'CAF': 'Central African Republic',
      'TCD': 'Chad',
      'GIN': 'Guinea',
      'GNB': 'Guinea-Bissau',
      'CIV': 'Ivory Coast',
      'SLE': 'Sierra Leone',
      'LBR': 'Liberia',
      'BFA': 'Burkina Faso',
      'NER': 'Niger',
      'TGO': 'Togo',
      'BEN': 'Benin',
      'GHA': 'Ghana',
      'MLI': 'Mali',
      'SEN': 'Senegal',
      'GMB': 'Gambia',
      'MRT': 'Mauritania',
      'DZA': 'Algeria',
      'MAR': 'Morocco',
      'TUN': 'Tunisia',
      'EGY': 'Egypt',
      'LBY': 'Libya',
      'ETH': 'Ethiopia',
      'ERI': 'Eritrea',
      'KEN': 'Kenya',
      'TZA': 'Tanzania',
      'UGA': 'Uganda',
      'RWA': 'Rwanda',
      'BDI': 'Burundi'
    };

    // Try fallback mapping
    if (whoToNameMap[countryCode]) {
      return whoToNameMap[countryCode];
    }

    // Final fallback: return a cleaned up version of the country code
    return this.cleanCountryCode(countryCode);
  }

  // Clean up country code to be more readable
  private cleanCountryCode(code: string): string {
    // Convert to title case and expand common abbreviations
    const cleanMap: { [key: string]: string } = {
      'USA': 'United States',
      'GBR': 'United Kingdom', 
      'DEU': 'Germany',
      'FRA': 'France',
      'ITA': 'Italy',
      'ESP': 'Spain',
      'RUS': 'Russia',
      'CHN': 'China',
      'JPN': 'Japan',
      'KOR': 'South Korea',
      'PRK': 'North Korea',
      'IND': 'India',
      'PAK': 'Pakistan',
      'BGD': 'Bangladesh',
      'IDN': 'Indonesia',
      'THA': 'Thailand',
      'VNM': 'Vietnam',
      'PHL': 'Philippines',
      'MYS': 'Malaysia',
      'SGP': 'Singapore'
    };

    return cleanMap[code] || code;
  }

  // Convert ISO3 to ISO2 codes for common countries (fallback)
  private getISO2FromISO3(iso3: string): string {
    const iso3ToISO2Map: { [key: string]: string } = {
      'AFG': 'af', 'ALB': 'al', 'DZA': 'dz', 'AND': 'ad', 'AGO': 'ao',
      'ATG': 'ag', 'ARG': 'ar', 'ARM': 'am', 'AUS': 'au', 'AUT': 'at',
      'AZE': 'az', 'BHS': 'bs', 'BHR': 'bh', 'BGD': 'bd', 'BRB': 'bb',
      'BLR': 'by', 'BEL': 'be', 'BLZ': 'bz', 'BEN': 'bj', 'BTN': 'bt',
      'BOL': 'bo', 'BIH': 'ba', 'BWA': 'bw', 'BRA': 'br', 'BRN': 'bn',
      'BGR': 'bg', 'BFA': 'bf', 'BDI': 'bi', 'CPV': 'cv', 'KHM': 'kh',
      'CMR': 'cm', 'CAN': 'ca', 'CAF': 'cf', 'TCD': 'td', 'CHL': 'cl',
      'CHN': 'cn', 'COL': 'co', 'COM': 'km', 'COG': 'cg', 'COD': 'cd',
      'CRI': 'cr', 'CIV': 'ci', 'HRV': 'hr', 'CUB': 'cu', 'CYP': 'cy',
      'CZE': 'cz', 'DNK': 'dk', 'DJI': 'dj', 'DMA': 'dm', 'DOM': 'do',
      'ECU': 'ec', 'EGY': 'eg', 'SLV': 'sv', 'GNQ': 'gq', 'ERI': 'er',
      'EST': 'ee', 'ETH': 'et', 'FJI': 'fj', 'FIN': 'fi', 'FRA': 'fr',
      'GAB': 'ga', 'GMB': 'gm', 'GEO': 'ge', 'DEU': 'de', 'GHA': 'gh',
      'GRC': 'gr', 'GRD': 'gd', 'GTM': 'gt', 'GIN': 'gn', 'GNB': 'gw',
      'GUY': 'gy', 'HTI': 'ht', 'HND': 'hn', 'HUN': 'hu', 'ISL': 'is',
      'IND': 'in', 'IDN': 'id', 'IRN': 'ir', 'IRQ': 'iq', 'IRL': 'ie',
      'ISR': 'il', 'ITA': 'it', 'JAM': 'jm', 'JPN': 'jp', 'JOR': 'jo',
      'KAZ': 'kz', 'KEN': 'ke', 'KIR': 'ki', 'PRK': 'kp', 'KOR': 'kr',
      'KWT': 'kw', 'KGZ': 'kg', 'LAO': 'la', 'LVA': 'lv', 'LBN': 'lb',
      'LSO': 'ls', 'LBR': 'lr', 'LBY': 'ly', 'LIE': 'li', 'LTU': 'lt',
      'LUX': 'lu', 'MKD': 'mk', 'MDG': 'mg', 'MWI': 'mw', 'MYS': 'my',
      'MDV': 'mv', 'MLI': 'ml', 'MLT': 'mt', 'MHL': 'mh', 'MRT': 'mr',
      'MUS': 'mu', 'MEX': 'mx', 'FSM': 'fm', 'MDA': 'md', 'MCO': 'mc',
      'MNG': 'mn', 'MNE': 'me', 'MAR': 'ma', 'MOZ': 'mz', 'MMR': 'mm',
      'NAM': 'na', 'NRU': 'nr', 'NPL': 'np', 'NLD': 'nl', 'NZL': 'nz',
      'NIC': 'ni', 'NER': 'ne', 'NGA': 'ng', 'NOR': 'no', 'OMN': 'om',
      'PAK': 'pk', 'PLW': 'pw', 'PAN': 'pa', 'PNG': 'pg', 'PRY': 'py',
      'PER': 'pe', 'PHL': 'ph', 'POL': 'pl', 'PRT': 'pt', 'QAT': 'qa',
      'ROU': 'ro', 'RUS': 'ru', 'RWA': 'rw', 'KNA': 'kn', 'LCA': 'lc',
      'VCT': 'vc', 'WSM': 'ws', 'SMR': 'sm', 'STP': 'st', 'SAU': 'sa',
      'SEN': 'sn', 'SRB': 'rs', 'SYC': 'sc', 'SLE': 'sl', 'SGP': 'sg',
      'SVK': 'sk', 'SVN': 'si', 'SLB': 'sb', 'SOM': 'so', 'ZAF': 'za',
      'SSD': 'ss', 'ESP': 'es', 'LKA': 'lk', 'SDN': 'sd', 'SUR': 'sr',
      'SWZ': 'sz', 'SWE': 'se', 'CHE': 'ch', 'SYR': 'sy', 'TWN': 'tw',
      'TJK': 'tj', 'TZA': 'tz', 'THA': 'th', 'TLS': 'tl', 'TGO': 'tg',
      'TON': 'to', 'TTO': 'tt', 'TUN': 'tn', 'TUR': 'tr', 'TKM': 'tm',
      'TUV': 'tv', 'UGA': 'ug', 'UKR': 'ua', 'ARE': 'ae', 'GBR': 'gb',
      'USA': 'us', 'URY': 'uy', 'UZB': 'uz', 'VUT': 'vu', 'VEN': 've',
      'VNM': 'vn', 'YEM': 'ye', 'ZMB': 'zm', 'ZWE': 'zw'
    };

    return iso3ToISO2Map[iso3] || iso3.toLowerCase().substring(0, 2);
  }
}

export const flagService = new FlagService();