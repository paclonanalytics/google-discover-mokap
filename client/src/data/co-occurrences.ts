export type CoOccurrence = {
  id: string;
  name: string;
  relatedEntities: string[];
  publications: number;
  traffic: number;
  pubChange: number;
  trafficChange: number;
};

export const risingCoOccurrences: CoOccurrence[] = [
  {
    id: "1",
    name: "Climate Change",
    relatedEntities: ["Carbon Credits", "UN Climate Pact", "Net Zero Targets"],
    publications: 120,
    traffic: 50000,
    pubChange: 15,
    trafficChange: 20,
  },
  {
    id: "2",
    name: "Renewable Energy",
    relatedEntities: ["Solar Parks", "Wind Turbines", "Green Financing"],
    publications: 95,
    traffic: 42000,
    pubChange: 12,
    trafficChange: 18,
  },
  {
    id: "3",
    name: "Electric Vehicles",
    relatedEntities: ["Battery Supply Chain", "Charging Network", "Sustainable Mobility"],
    publications: 88,
    traffic: 38000,
    pubChange: 10,
    trafficChange: 15,
  },
  {
    id: "4",
    name: "Carbon Tax",
    relatedEntities: ["EU ETS", "Policy Reform", "Corporate Disclosures"],
    publications: 76,
    traffic: 31000,
    pubChange: 8,
    trafficChange: 12,
  },
  {
    id: "5",
    name: "Green Tech",
    relatedEntities: ["Climate VC", "Hardware Startups", "AI Optimization"],
    publications: 65,
    traffic: 28000,
    pubChange: 6,
    trafficChange: 10,
  },
];

export const fallingCoOccurrences: CoOccurrence[] = [
  {
    id: "6",
    name: "Oil Prices",
    relatedEntities: ["Barrel Forecasts", "OPEC+", "Commodity Futures"],
    publications: 110,
    traffic: 48000,
    pubChange: -8,
    trafficChange: -5,
  },
  {
    id: "7",
    name: "Coal Mining",
    relatedEntities: ["Thermal Plants", "Supply Contracts", "Port Logistics"],
    publications: 55,
    traffic: 22000,
    pubChange: -12,
    trafficChange: -15,
  },
  {
    id: "8",
    name: "Diesel Engines",
    relatedEntities: ["ICE Ban", "Fleet Renewals", "Emission Standards"],
    publications: 45,
    traffic: 18000,
    pubChange: -10,
    trafficChange: -12,
  },
  {
    id: "9",
    name: "Single-use Plastics",
    relatedEntities: ["Waste Policy", "Packaging Reform", "Retail Regulation"],
    publications: 32,
    traffic: 12000,
    pubChange: -15,
    trafficChange: -18,
  },
  {
    id: "10",
    name: "Deforestation",
    relatedEntities: ["Illegal Logging", "Biodiversity", "Agro Commodities"],
    publications: 28,
    traffic: 11000,
    pubChange: -5,
    trafficChange: -8,
  },
];

export const allCoOccurrences: CoOccurrence[] = [
  ...risingCoOccurrences,
  ...fallingCoOccurrences,
];

export const findCoOccurrenceById = (id: string) =>
  allCoOccurrences.find((item) => item.id === id);

