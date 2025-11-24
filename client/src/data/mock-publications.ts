import { publisherRecords } from "@/data/publishers";

export type Publication = {
  id: string;
  title: string;
  domain: string;
  favicon: string;
  image: string;
  country: string;
  type: string;
  format: string[];
  category: string;
  entities: string[];
  dds: number;
  lifetime: string;
  avgPosition: number;
  estTraffic: string;
  publishedDate: string;
  badges: string[];
};

const sampleEntities = [
  ["Artificial Intelligence", "Google", "Pixel 9"],
  ["Climate Summit", "UN", "2030 Goals"],
  ["Electric Vehicles", "Tesla", "Battery Tech"],
  ["Cybersecurity", "Zero Trust", "Microsoft"],
  ["Renewable Energy", "Solar Farm", "Wind Alliance"],
  ["Metaverse", "Meta", "VR"],
];

const sampleImages = [
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1506097425191-7ad538b29cef?auto=format&fit=crop&w=800&q=60",
  "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?auto=format&fit=crop&w=800&q=60",
];

const countries = ["USA", "UK", "Germany", "France", "Canada", "Spain"];
const types = ["Article", "Video", "Analysis"];
const formats = [["title-image"], ["title-only"], ["image-top"]];
const categories = ["Technology", "Politics", "Business", "Sustainability"];

const publicationsPerPublisher = 8;

export const mockPublications: Publication[] = Array.from(
  { length: publisherRecords.length * publicationsPerPublisher },
  (_, i) => {
    const source = publisherRecords[i % publisherRecords.length];
    const country = countries[i % countries.length];
    const category = source.mainCategory ?? categories[i % categories.length];
    const estTrafficValue = Math.max(
      20,
      Math.round((source.estTraffic / 1_000 + Math.random() * 120) / 10) * 10
    );

    return {
      id: `pub-${i}`,
      title: `Sample Article Title ${i + 1}: Breaking News and Insights on the Topic`,
      domain: source.domain,
      favicon: source.favicon || `https://www.google.com/s2/favicons?domain=${source.domain}`,
      image: sampleImages[i % sampleImages.length],
      country,
      type: types[i % types.length],
      format: formats[i % formats.length],
      category,
      entities: sampleEntities[i % sampleEntities.length],
      dds: Math.max(70, source.dds - (i % 12)),
      lifetime: `${12 + (i % 36)}h`,
      avgPosition: parseFloat((2.5 + (i % 5)).toFixed(1)),
      estTraffic: `${estTrafficValue.toFixed(1)}K`,
      publishedDate: `${(i % 5) + 1}h ago`,
      badges:
        i % 5 === 0
          ? ["new", "trending"]
          : i % 7 === 0
          ? ["new", "wide_geo"]
          : i % 4 === 0
          ? ["reappeared"]
          : [],
    };
  }
);

