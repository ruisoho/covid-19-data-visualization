export interface Country {
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  critical: number;
  tests: number;
  population: number;
  continent: string;
  casesPerOneMillion?: number;
  deathsPerOneMillion?: number;
  testsPerOneMillion?: number;
  oneCasePerPeople?: number;
  oneDeathPerPeople?: number;
  oneTestPerPeople?: number;
  activePerOneMillion?: number;
  recoveredPerOneMillion?: number;
  criticalPerOneMillion?: number;
  updated?: number;
}

export interface GlobalData {
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  critical: number;
  tests: number;
  population: number;
}

export interface HistoricalData {
  country: string;
  province?: string[];
  timeline: {
    cases: Record<string, number>;
    deaths: Record<string, number>;
    recovered: Record<string, number>;
  };
}