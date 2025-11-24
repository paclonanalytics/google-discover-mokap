import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Calendar, GitCompare, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const numberFormatter = new Intl.NumberFormat("en-US");

const COUNTRY_OPTIONS = [
  { value: "all", label: "All countries" },
  { value: "usa", label: "USA" },
  { value: "russia", label: "Russia" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
] as const;

const PERIOD_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "24h", label: "24 hours" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "custom", label: "Custom period" },
] as const;

type CompareMode = "country" | "language" | "period" | null;
type MetricKey = "rating" | "publications" | "avgLifetime" | "estTraffic";

type MetricSnapshot = {
  rating: number;
  publications: number;
  avgLifetime: number;
  estTraffic: number;
};

const getOptionLabel = (options: ReadonlyArray<{ value: string; label: string }>, value: string) =>
  options.find((option) => option.value === value)?.label ?? value;

const parseLifetimeHours = (value: string) => {
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
};

const parseTrafficValue = (value: string) => {
  const numeric = parseFloat(value);
  if (Number.isNaN(numeric)) return null;
  if (value.toLowerCase().includes("m")) {
    return numeric * 1_000_000;
  }
  return numeric * 1_000;
};

const formatLifetimeHours = (hours: number | null) => {
  if (hours === null) return "—";
  return `${Math.round(hours)}h`;
};

const formatTrafficValue = (value: number | null) => {
  if (value === null) return "—";
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${Math.round(value / 1_000)}K`;
};

const getSeed = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const getMultiplier = (seedInput: string, min = 0.85, max = 1.2) => {
  const normalized = (getSeed(seedInput) % 1000) / 1000;
  return min + (max - min) * normalized;
};

const createComparisonSnapshot = (entity: EntityRecord, mode: Exclude<CompareMode, null>, target: string): MetricSnapshot => {
  const baseLifetime = parseLifetimeHours(entity.avgLifetime) ?? 0;
  const baseTraffic = parseTrafficValue(entity.estTraffic) ?? 0;
  const ratingMultiplier = getMultiplier(`${entity.id}-${mode}-${target}-rating`);
  const publicationMultiplier = getMultiplier(`${entity.id}-${mode}-${target}-publications`, 0.8, 1.35);
  const lifetimeMultiplier = getMultiplier(`${entity.id}-${mode}-${target}-lifetime`, 0.7, 1.3);
  const trafficMultiplier = getMultiplier(`${entity.id}-${mode}-${target}-traffic`, 0.75, 1.4);

  return {
    rating: Math.max(1, Math.round(entity.rating * ratingMultiplier)),
    publications: Math.max(1, Math.round(entity.publications * publicationMultiplier)),
    avgLifetime: Math.max(4, Math.round(baseLifetime * lifetimeMultiplier)),
    estTraffic: Math.max(50_000, Math.round(baseTraffic * trafficMultiplier)),
  };
};

const getDiffAbsolute = (baseValue: number | null, compareValue: number | null) => {
  if (baseValue === null || compareValue === null) return null;
  return compareValue - baseValue;
};

const formatDiffValue = (diff: number | null, metric: MetricKey) => {
  if (diff === null) return "—";
  const sign = diff > 0 ? "+" : diff < 0 ? "-" : "";
  const absValue = Math.abs(diff);

  switch (metric) {
    case "rating":
      return `${sign}${absValue}`;
    case "publications":
      return `${sign}${numberFormatter.format(absValue)}`;
    case "avgLifetime":
      return `${sign}${formatLifetimeHours(absValue)}`;
    case "estTraffic":
      return `${sign}${formatTrafficValue(absValue)}`;
    default:
      return `${sign}${absValue}`;
  }
};

const getDiffClass = (diff: number | null) => {
  if (diff === null) return "text-muted-foreground";
  if (diff > 0) return "text-green-600";
  if (diff < 0) return "text-red-600";
  return "text-muted-foreground";
};

const getMetricNumericValue = (entity: EntityRecord, metric: MetricKey): number | null => {
  switch (metric) {
    case "rating":
      return entity.rating;
    case "publications":
      return entity.publications;
    case "avgLifetime":
      return parseLifetimeHours(entity.avgLifetime);
    case "estTraffic":
      return parseTrafficValue(entity.estTraffic);
    default:
      return null;
  }
};

const getMetricDisplayValue = (entity: EntityRecord, metric: MetricKey) => {
  switch (metric) {
    case "rating":
      return entity.rating.toString();
    case "publications":
      return numberFormatter.format(entity.publications);
    case "avgLifetime":
      return entity.avgLifetime;
    case "estTraffic":
      return entity.estTraffic;
    default:
      return "—";
  }
};

const formatComparisonMetricValue = (snapshot: MetricSnapshot | undefined, metric: MetricKey) => {
  if (!snapshot) return "—";
  switch (metric) {
    case "rating":
      return snapshot.rating.toString();
    case "publications":
      return numberFormatter.format(snapshot.publications);
    case "avgLifetime":
      return formatLifetimeHours(snapshot.avgLifetime);
    case "estTraffic":
      return formatTrafficValue(snapshot.estTraffic);
    default:
      return "—";
  }
};

const MiniBarChart = ({ data }: { data: number[] }) => {
  if (!data.length) return null;
  const width = Math.max(data.length * 6, 60);
  const height = 28;
  const maxValue = Math.max(...data);
  const scale = Math.max(maxValue, 1);

  return (
    <svg width={width} height={height} className="text-primary/80" aria-hidden="true">
      {data.map((value, index) => {
        const barHeight = (value / scale) * (height - 6);
        return (
          <rect
            key={`${value}-${index}`}
            x={index * 6}
            y={height - barHeight}
            width={4}
            height={barHeight}
            rx={1}
            fill="currentColor"
            className="text-primary/60"
          />
        );
      })}
    </svg>
  );
};

const generateTrendSeries = (current: number, change: number) => {
  const points = 8;
  const slopeFactor = Math.max(0.2, 1 + change / 100);
  const startValue = Math.max(0, current / slopeFactor);
  const steps = Math.max(points - 1, 1);
  const delta = (current - startValue) / steps;

  return Array.from({ length: points }, (_, index) => {
    if (index === points - 1) return current;
    return Math.max(0, Math.round(startValue + delta * index));
  });
};

type EntityRecord = {
  id: string;
  name: string;
  rating: number;
  ratingChange: number;
  publications: number;
  publicationsChange: number;
  publicationsTrend: number[];
  avgLifetime: string;
  estTraffic: string;
  category: "technology" | "finance" | "health" | "sports" | "entertainment";
  format: "article" | "video" | "analysis" | "listicle" | "carousel";
  publisher: string;
  country: "usa" | "russia" | "uk" | "germany" | "france";
  language: "en" | "ru" | "de" | "fr" | "es";
  periods: Array<"live" | "24h" | "week" | "month">;
  isNew: boolean;
};

type RawEntityRecord = Omit<EntityRecord, "rating" | "publicationsTrend" | "isNew"> & {
  isNew?: boolean;
};

const rawEntities: RawEntityRecord[] = [
  {
    id: "artificial-intelligence",
    name: "Artificial Intelligence",
    ratingChange: 3,
    publications: 1480,
    publicationsChange: 22,
    avgLifetime: "19h",
    estTraffic: "240K",
    category: "technology",
    format: "article",
    publisher: "TechCrunch",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week", "month"],
    isNew: false,
  },
  {
    id: "climate-resilience",
    name: "Climate Resilience",
    ratingChange: 1,
    publications: 1184,
    publicationsChange: 11,
    avgLifetime: "23h",
    estTraffic: "198K",
    category: "health",
    format: "analysis",
    publisher: "National Geographic",
    country: "uk",
    language: "en",
    periods: ["24h", "week", "month"],
    isNew: false,
  },
  {
    id: "electric-mobility",
    name: "Electric Mobility",
    ratingChange: -1,
    publications: 1092,
    publicationsChange: 8,
    avgLifetime: "17h",
    estTraffic: "210K",
    category: "technology",
    format: "video",
    publisher: "Handelsblatt",
    country: "germany",
    language: "de",
    periods: ["live", "24h", "week"],
  },
  {
    id: "decentralized-finance",
    name: "Decentralized Finance",
    ratingChange: -2,
    publications: 1015,
    publicationsChange: -4,
    avgLifetime: "14h",
    estTraffic: "187K",
    category: "finance",
    format: "analysis",
    publisher: "CoinDesk",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week", "month"],
  },
  {
    id: "orbital-tourism",
    name: "Orbital Tourism",
    ratingChange: 2,
    publications: 964,
    publicationsChange: 15,
    avgLifetime: "25h",
    estTraffic: "176K",
    category: "entertainment",
    format: "article",
    publisher: "Le Monde",
    country: "france",
    language: "fr",
    periods: ["24h", "week", "month"],
  },
  {
    id: "green-hydrogen",
    name: "Green Hydrogen",
    ratingChange: 4,
    publications: 899,
    publicationsChange: 18,
    avgLifetime: "21h",
    estTraffic: "162K",
    category: "health",
    format: "analysis",
    publisher: "Bloomberg",
    country: "uk",
    language: "en",
    periods: ["week", "month"],
  },
  {
    id: "quantum-encryption",
    name: "Quantum Encryption",
    ratingChange: 5,
    publications: 872,
    publicationsChange: 20,
    avgLifetime: "16h",
    estTraffic: "169K",
    category: "technology",
    format: "article",
    publisher: "The Economist",
    country: "uk",
    language: "en",
    periods: ["live", "24h", "week"],
    isNew: true,
  },
  {
    id: "mixed-reality",
    name: "Mixed Reality",
    ratingChange: -1,
    publications: 815,
    publicationsChange: -3,
    avgLifetime: "12h",
    estTraffic: "154K",
    category: "entertainment",
    format: "video",
    publisher: "UploadVR",
    country: "usa",
    language: "en",
    periods: ["24h", "week"],
  },
  {
    id: "gene-editing",
    name: "Gene Editing",
    ratingChange: 2,
    publications: 784,
    publicationsChange: 14,
    avgLifetime: "24h",
    estTraffic: "147K",
    category: "health",
    format: "article",
    publisher: "Nature",
    country: "uk",
    language: "en",
    periods: ["24h", "week", "month"],
  },
  {
    id: "5g-infrastructure",
    name: "5G Infrastructure",
    ratingChange: 0,
    publications: 759,
    publicationsChange: 7,
    avgLifetime: "18h",
    estTraffic: "141K",
    category: "technology",
    format: "analysis",
    publisher: "GSMArena",
    country: "germany",
    language: "de",
    periods: ["live", "24h", "week"],
  },
  {
    id: "cyber-defense-systems",
    name: "Cyber Defense Systems",
    ratingChange: 6,
    publications: 742,
    publicationsChange: 21,
    avgLifetime: "19h",
    estTraffic: "189K",
    category: "finance",
    format: "article",
    publisher: "Darktrace Labs",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week"],
  },
  {
    id: "precision-medicine",
    name: "Precision Medicine",
    ratingChange: 1,
    publications: 701,
    publicationsChange: 9,
    avgLifetime: "22h",
    estTraffic: "134K",
    category: "health",
    format: "analysis",
    publisher: "Stat News",
    country: "france",
    language: "fr",
    periods: ["week", "month"],
    isNew: true,
  },
  {
    id: "spatial-computing",
    name: "Spatial Computing",
    ratingChange: 3,
    publications: 664,
    publicationsChange: 12,
    avgLifetime: "17h",
    estTraffic: "138K",
    category: "technology",
    format: "article",
    publisher: "MIT Tech Review",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week"],
  },
  {
    id: "autonomous-logistics",
    name: "Autonomous Logistics",
    ratingChange: -2,
    publications: 642,
    publicationsChange: -6,
    avgLifetime: "15h",
    estTraffic: "129K",
    category: "technology",
    format: "video",
    publisher: "Logistics Insider",
    country: "germany",
    language: "de",
    periods: ["24h", "week"],
  },
  {
    id: "smart-manufacturing",
    name: "Smart Manufacturing",
    ratingChange: 2,
    publications: 619,
    publicationsChange: 10,
    avgLifetime: "18h",
    estTraffic: "125K",
    category: "technology",
    format: "analysis",
    publisher: "Industry Week",
    country: "russia",
    language: "ru",
    periods: ["week", "month"],
  },
  {
    id: "esports-franchises",
    name: "Esports Franchises",
    ratingChange: -1,
    publications: 587,
    publicationsChange: -2,
    avgLifetime: "13h",
    estTraffic: "118K",
    category: "sports",
    format: "video",
    publisher: "Dot Esports",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week"],
  },
  {
    id: "wearable-fitness",
    name: "Wearable Fitness",
    ratingChange: 4,
    publications: 566,
    publicationsChange: 16,
    avgLifetime: "14h",
    estTraffic: "121K",
    category: "sports",
    format: "article",
    publisher: "Runner's World",
    country: "usa",
    language: "en",
    periods: ["24h", "week"],
    isNew: true,
  },
  {
    id: "metabolic-health",
    name: "Metabolic Health",
    ratingChange: 1,
    publications: 548,
    publicationsChange: 6,
    avgLifetime: "20h",
    estTraffic: "119K",
    category: "health",
    format: "analysis",
    publisher: "Healthline",
    country: "france",
    language: "es",
    periods: ["week", "month"],
  },
  {
    id: "plant-based-food",
    name: "Plant-Based Food",
    ratingChange: -3,
    publications: 533,
    publicationsChange: -5,
    avgLifetime: "18h",
    estTraffic: "111K",
    category: "health",
    format: "listicle",
    publisher: "Food52",
    country: "france",
    language: "fr",
    periods: ["24h", "week"],
  },
  {
    id: "water-security",
    name: "Water Security",
    ratingChange: 2,
    publications: 517,
    publicationsChange: 9,
    avgLifetime: "26h",
    estTraffic: "108K",
    category: "finance",
    format: "analysis",
    publisher: "Aquatech",
    country: "uk",
    language: "en",
    periods: ["week", "month"],
  },
  {
    id: "battery-innovation",
    name: "Battery Innovation",
    ratingChange: 3,
    publications: 498,
    publicationsChange: 13,
    avgLifetime: "16h",
    estTraffic: "116K",
    category: "technology",
    format: "article",
    publisher: "InsideEVs",
    country: "germany",
    language: "de",
    periods: ["live", "24h", "week"],
  },
  {
    id: "supply-chain-ai",
    name: "Supply Chain AI",
    ratingChange: 1,
    publications: 482,
    publicationsChange: 5,
    avgLifetime: "15h",
    estTraffic: "104K",
    category: "finance",
    format: "analysis",
    publisher: "Supply Chain Dive",
    country: "usa",
    language: "en",
    periods: ["24h", "week"],
  },
  {
    id: "edge-computing",
    name: "Edge Computing",
    ratingChange: -1,
    publications: 471,
    publicationsChange: -2,
    avgLifetime: "13h",
    estTraffic: "107K",
    category: "technology",
    format: "article",
    publisher: "EdgeNode",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week"],
  },
  {
    id: "agritech-platforms",
    name: "AgriTech Platforms",
    ratingChange: 2,
    publications: 458,
    publicationsChange: 12,
    avgLifetime: "21h",
    estTraffic: "101K",
    category: "health",
    format: "analysis",
    publisher: "AgFunder",
    country: "france",
    language: "fr",
    periods: ["week", "month"],
  },
  {
    id: "renewable-storage",
    name: "Renewable Storage",
    ratingChange: 0,
    publications: 446,
    publicationsChange: 4,
    avgLifetime: "20h",
    estTraffic: "96K",
    category: "technology",
    format: "article",
    publisher: "Energy Storage News",
    country: "uk",
    language: "en",
    periods: ["24h", "week"],
  },
  {
    id: "urban-mobility",
    name: "Urban Mobility",
    ratingChange: -2,
    publications: 432,
    publicationsChange: -6,
    avgLifetime: "14h",
    estTraffic: "99K",
    category: "technology",
    format: "video",
    publisher: "CityLab",
    country: "germany",
    language: "de",
    periods: ["live", "24h", "week"],
  },
  {
    id: "voice-assistants",
    name: "Voice Assistants",
    ratingChange: 1,
    publications: 427,
    publicationsChange: 7,
    avgLifetime: "12h",
    estTraffic: "94K",
    category: "entertainment",
    format: "listicle",
    publisher: "The Information",
    country: "usa",
    language: "en",
    periods: ["24h", "week"],
  },
  {
    id: "digital-twins",
    name: "Digital Twins",
    ratingChange: 4,
    publications: 416,
    publicationsChange: 15,
    avgLifetime: "22h",
    estTraffic: "102K",
    category: "technology",
    format: "analysis",
    publisher: "Digital Engineering",
    country: "uk",
    language: "en",
    periods: ["week", "month"],
    isNew: true,
  },
  {
    id: "climate-fintech",
    name: "Climate Fintech",
    ratingChange: 2,
    publications: 401,
    publicationsChange: 9,
    avgLifetime: "18h",
    estTraffic: "90K",
    category: "finance",
    format: "article",
    publisher: "Climate VC",
    country: "usa",
    language: "en",
    periods: ["24h", "week"],
  },
  {
    id: "neurotechnology",
    name: "Neurotechnology",
    ratingChange: -1,
    publications: 389,
    publicationsChange: -4,
    avgLifetime: "16h",
    estTraffic: "92K",
    category: "health",
    format: "video",
    publisher: "Singularity Hub",
    country: "france",
    language: "es",
    periods: ["week", "month"],
  },
  {
    id: "robotic-process-automation",
    name: "Robotic Process Automation",
    ratingChange: 3,
    publications: 374,
    publicationsChange: 11,
    avgLifetime: "15h",
    estTraffic: "88K",
    category: "technology",
    format: "analysis",
    publisher: "Automation World",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week"],
  },
  {
    id: "bioinformatics-networks",
    name: "Bioinformatics Networks",
    ratingChange: 1,
    publications: 362,
    publicationsChange: 6,
    avgLifetime: "23h",
    estTraffic: "83K",
    category: "health",
    format: "article",
    publisher: "GenomeWeb",
    country: "france",
    language: "fr",
    periods: ["week", "month"],
  },
  {
    id: "carbon-markets",
    name: "Carbon Markets",
    ratingChange: -1,
    publications: 351,
    publicationsChange: -3,
    avgLifetime: "19h",
    estTraffic: "81K",
    category: "finance",
    format: "analysis",
    publisher: "Financial Times",
    country: "uk",
    language: "en",
    periods: ["24h", "week"],
  },
  {
    id: "immersive-retail",
    name: "Immersive Retail",
    ratingChange: 2,
    publications: 339,
    publicationsChange: 10,
    avgLifetime: "13h",
    estTraffic: "79K",
    category: "entertainment",
    format: "carousel",
    publisher: "RetailDive",
    country: "usa",
    language: "en",
    periods: ["live", "24h", "week"],
    isNew: true,
  },
  {
    id: "biofuels-2",
    name: "Biofuels 2.0",
    ratingChange: -2,
    publications: 327,
    publicationsChange: -7,
    avgLifetime: "21h",
    estTraffic: "76K",
    category: "health",
    format: "analysis",
    publisher: "Biofuel Digest",
    country: "russia",
    language: "ru",
    periods: ["week", "month"],
  },
];

const entitiesData: EntityRecord[] = rawEntities.map((entity, index) => ({
  ...entity,
  rating: index + 1,
  publicationsTrend: generateTrendSeries(entity.publications, entity.publicationsChange),
  isNew: entity.isNew ?? false,
}));

type CountryFilter = EntityRecord["country"] | "all";
type LanguageFilter = EntityRecord["language"] | "all";
type CategoryFilter = EntityRecord["category"] | "all";
type FormatFilter = EntityRecord["format"] | "all";
type PeriodFilter = "live" | "24h" | "week" | "month" | "custom";

const formatChange = (value: number, suffix = "%") => {
  if (value === 0) return `0${suffix}`;
  return `${value > 0 ? "+" : "-"}${Math.abs(value)}${suffix}`;
};

export default function Entities() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState<CountryFilter>("all");
  const [filterLanguage, setFilterLanguage] = useState<LanguageFilter>("all");
  const [filterCategory, setFilterCategory] = useState<CategoryFilter>("all");
  const [filterFormat, setFilterFormat] = useState<FormatFilter>("all");
  const [period, setPeriod] = useState<PeriodFilter>("week");
  const [page, setPage] = useState(1);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const [compareMode, setCompareMode] = useState<CompareMode>(null);
  const [compareTarget, setCompareTarget] = useState<string | undefined>(undefined);
  const [comparePopoverOpen, setComparePopoverOpen] = useState(false);
  const filterSectionRef = useRef<HTMLDivElement>(null);

  const pageSize = 30;

  const handleFilterCountryChange = (value: string) => setFilterCountry(value as CountryFilter);
  const handleFilterLanguageChange = (value: string) => setFilterLanguage(value as LanguageFilter);
  const handleFilterCategoryChange = (value: string) => setFilterCategory(value as CategoryFilter);
  const handleFilterFormatChange = (value: string) => setFilterFormat(value as FormatFilter);
  const handlePeriodChange = (value: string) => setPeriod(value as PeriodFilter);
  const clearComparison = () => {
    setCompareMode(null);
    setCompareTarget(undefined);
    setComparePopoverOpen(false);
  };

  const comparisonOptionList = useMemo(() => {
    if (!compareMode) return [];
    switch (compareMode) {
      case "country":
        return COUNTRY_OPTIONS;
      case "language":
        return LANGUAGE_OPTIONS;
      case "period":
        return PERIOD_OPTIONS;
      default:
        return [];
    }
  }, [compareMode]);

  const comparisonLabels = useMemo(() => {
    if (!compareMode) return null;
    const baseValue =
      compareMode === "country"
        ? filterCountry
        : compareMode === "language"
          ? filterLanguage
          : period;
    const baseLabel = getOptionLabel(comparisonOptionList, baseValue);
    const targetLabel = compareTarget ? getOptionLabel(comparisonOptionList, compareTarget) : "";
    const dimensionLabel =
      compareMode === "country" ? "Country" : compareMode === "language" ? "Language" : "Period";
    return { baseLabel, targetLabel, dimensionLabel };
  }, [compareMode, comparisonOptionList, filterCountry, filterLanguage, period, compareTarget]);

  const isComparisonActive = Boolean(compareMode && compareTarget);
  const comparisonSummary =
    isComparisonActive && comparisonLabels
      ? `${comparisonLabels.dimensionLabel}: ${comparisonLabels.baseLabel} vs ${comparisonLabels.targetLabel}`
      : null;

  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    filterCountry,
    filterLanguage,
    filterCategory,
    filterFormat,
    period,
    compareMode,
    compareTarget,
  ]);

  useEffect(() => {
    if (!compareMode) {
      setCompareTarget(undefined);
    }
  }, [compareMode]);


  useEffect(() => {
    if (!compareMode || !compareTarget) return;
    if (
      (compareMode === "country" && compareTarget === filterCountry) ||
      (compareMode === "language" && compareTarget === filterLanguage) ||
      (compareMode === "period" && compareTarget === period)
    ) {
      setCompareTarget(undefined);
    }
  }, [compareMode, compareTarget, filterCountry, filterLanguage, period]);

  useEffect(() => {
    const handleScroll = () => {
      if (!filterSectionRef.current) return;
      const rect = filterSectionRef.current.getBoundingClientRect();
      const shouldShow = rect.bottom <= -10;
      setShowStickyFilters(shouldShow);
    };

    const mainContainer = document.querySelector("main");
    if (!mainContainer) return;

    handleScroll();
    mainContainer.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      mainContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const filteredEntities = useMemo(() => {
    return entitiesData.filter((entity) => {
      if (searchQuery && !entity.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filterCountry !== "all" && entity.country !== filterCountry) return false;
      if (filterLanguage !== "all" && entity.language !== filterLanguage) return false;
      if (filterCategory !== "all" && entity.category !== filterCategory) return false;
      if (filterFormat !== "all" && entity.format !== filterFormat) return false;
      if (period !== "custom" && !entity.periods.includes(period)) return false;
      return true;
    });
  }, [searchQuery, filterCountry, filterLanguage, filterCategory, filterFormat, period]);

  const comparisonMetrics = useMemo(() => {
    if (!compareMode || !compareTarget) return null;
    const metricsMap = new Map<string, MetricSnapshot>();
    filteredEntities.forEach((entity) => {
      metricsMap.set(
        entity.id,
        createComparisonSnapshot(entity, compareMode as Exclude<CompareMode, null>, compareTarget)
      );
    });
    return metricsMap;
  }, [filteredEntities, compareMode, compareTarget]);

  const showComparisonColumns = Boolean(isComparisonActive && comparisonMetrics);
  const comparisonBaseLabel = comparisonLabels?.baseLabel ?? "Current view";
  const comparisonTargetLabel = comparisonLabels?.targetLabel ?? "Comparison";

  const totalPages = Math.max(1, Math.ceil(filteredEntities.length / pageSize));
  const paginatedEntities = filteredEntities.slice((page - 1) * pageSize, page * pageSize);

  const getTrendColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-muted-foreground";
  };

  const handleRowClick = (entityName: string) => {
    navigate(`/entity/${encodeURIComponent(entityName)}`);
  };

  return (
    <DashboardLayout
      showStickyFilters={showStickyFilters}
      filterCountry={filterCountry}
      setFilterCountry={handleFilterCountryChange}
      filterLanguage={filterLanguage}
      setFilterLanguage={handleFilterLanguageChange}
      filterCategory={filterCategory}
      setFilterCategory={handleFilterCategoryChange}
      filterFormat={filterFormat}
      setFilterFormat={handleFilterFormatChange}
      period={period}
      setPeriod={handlePeriodChange}
    >
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Entities</h1>
          <p className="text-muted-foreground">
            Сравнивайте динамику сущностей Discover по регионам, категориям и форматам публикаций.
          </p>
        </div>

        <div ref={filterSectionRef} className="border border-border shadow-sm rounded-lg bg-card">
          <div className="py-4 px-6">
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex flex-wrap gap-3">
                <Select value={filterCountry} onValueChange={handleFilterCountryChange}>
                  <SelectTrigger className="h-9 text-sm w-[150px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterLanguage} onValueChange={handleFilterLanguageChange}>
                  <SelectTrigger className="h-9 text-sm w-[160px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={handleFilterCategoryChange}>
                  <SelectTrigger className="h-9 text-sm w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterFormat} onValueChange={handleFilterFormatChange}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={period} onValueChange={handlePeriodChange}>
                  <SelectTrigger className="h-9 text-sm w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.value === "live" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            {option.label}
                          </div>
                        ) : option.value === "custom" ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {option.label}
                          </div>
                        ) : (
                          option.label
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button className="h-9 bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6">
                  Search
                </Button>
                <Popover open={comparePopoverOpen} onOpenChange={setComparePopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={isComparisonActive ? "secondary" : "outline"}
                      size="sm"
                      className="gap-2"
                      onClick={() => {
                        if (!compareMode) {
                          setCompareMode("country");
                        }
                        setComparePopoverOpen(true);
                      }}
                    >
                      <GitCompare className="w-4 h-4" />
                      {isComparisonActive ? "Comparing" : "Compare"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 space-y-4">
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">Dimension</p>
                      <Select
                        value={compareMode ?? ""}
                        onValueChange={(value) => setCompareMode((value || null) as CompareMode)}
                      >
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue placeholder="Select dimension" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="country">Country</SelectItem>
                          <SelectItem value="language">Language</SelectItem>
                          <SelectItem value="period">Period</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {compareMode && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
                          {compareMode === "country"
                            ? "Country to compare"
                            : compareMode === "language"
                              ? "Language to compare"
                              : "Period to compare"}
                        </p>
                        <Select value={compareTarget ?? ""} onValueChange={setCompareTarget}>
                          <SelectTrigger className="h-9 text-sm">
                            <SelectValue placeholder="Select value" />
                          </SelectTrigger>
                          <SelectContent>
                            {comparisonOptionList
                              .filter((option) => {
                                const baseValue =
                                  compareMode === "country"
                                    ? filterCountry
                                    : compareMode === "language"
                                      ? filterLanguage
                                      : period;
                                return option.value !== baseValue;
                              })
                              .map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {compareMode && (
                      <Button variant="ghost" size="sm" className="justify-start text-destructive" onClick={clearComparison}>
                        Reset comparison
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-10"
          />
        </div>

        {comparisonSummary && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <Badge variant="outline" className="bg-muted/30">
              {comparisonSummary}
            </Badge>
            <Button variant="link" size="sm" className="h-auto px-0" onClick={clearComparison}>
              Clear comparison
            </Button>
          </div>
        )}

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Entities leaderboard</CardTitle>
            <p className="text-sm text-muted-foreground">
              Showing {paginatedEntities.length} of {filteredEntities.length} entities
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            {filteredEntities.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Нет сущностей, удовлетворяющих выбранным фильтрам.
              </div>
            ) : (
              <>
                <TooltipProvider delayDuration={150}>
                  <Table>
                    <TableHeader>
                      <TableRow className="align-top">
                        {showComparisonColumns ? (
                          <>
                            <TableHead className="w-[150px]">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-1 cursor-help">
                                    Rating
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Сводный рейтинг видимости сущности vs прошлый период.</TooltipContent>
                              </Tooltip>
                              <span className="mt-1 block text-xs text-muted-foreground">{comparisonBaseLabel}</span>
                            </TableHead>
                            <TableHead className="w-[150px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Compare</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">{comparisonTargetLabel}</span>
                            </TableHead>
                            <TableHead className="w-[110px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Diff</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">Abs</span>
                            </TableHead>
                          </>
                        ) : (
                          <TableHead className="w-[220px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 cursor-help">
                                  Rating
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Сводный рейтинг видимости сущности vs прошлый период.</TooltipContent>
                            </Tooltip>
                          </TableHead>
                        )}
                        <TableHead>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center gap-1 cursor-help">
                                Entity
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Название сущности и связанный издатель.</TooltipContent>
                          </Tooltip>
                        </TableHead>
                        {showComparisonColumns ? (
                          <>
                            <TableHead className="w-[180px]">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-1 cursor-help">
                                    Publications
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Кол-во материалов за период и % изменения к предыдущему.
                                </TooltipContent>
                              </Tooltip>
                              <span className="mt-1 block text-xs text-muted-foreground">{comparisonBaseLabel}</span>
                            </TableHead>
                            <TableHead className="w-[160px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Compare</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">{comparisonTargetLabel}</span>
                            </TableHead>
                            <TableHead className="w-[120px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Diff</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">Abs</span>
                            </TableHead>
                          </>
                        ) : (
                          <TableHead className="w-[220px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 cursor-help">
                                  Publications
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                Кол-во материалов за период и % изменения к предыдущему.
                              </TooltipContent>
                            </Tooltip>
                          </TableHead>
                        )}
                        {showComparisonColumns ? (
                          <>
                            <TableHead className="w-[150px]">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-1 cursor-help">
                                    Avg Life Time
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Среднее время жизни публикаций в Discover.</TooltipContent>
                              </Tooltip>
                              <span className="mt-1 block text-xs text-muted-foreground">{comparisonBaseLabel}</span>
                            </TableHead>
                            <TableHead className="w-[150px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Compare</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">{comparisonTargetLabel}</span>
                            </TableHead>
                            <TableHead className="w-[110px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Diff</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">Abs</span>
                            </TableHead>
                          </>
                        ) : (
                          <TableHead className="w-[140px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 cursor-help">
                                  Avg Life Time
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Среднее время жизни публикаций в Discover.</TooltipContent>
                            </Tooltip>
                          </TableHead>
                        )}
                        {showComparisonColumns ? (
                          <>
                            <TableHead className="w-[150px]">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="inline-flex items-center gap-1 cursor-help">
                                    Est Traffic
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>Оценочный трафик, который принесли публикации.</TooltipContent>
                              </Tooltip>
                              <span className="mt-1 block text-xs text-muted-foreground">{comparisonBaseLabel}</span>
                            </TableHead>
                            <TableHead className="w-[150px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Compare</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">{comparisonTargetLabel}</span>
                            </TableHead>
                            <TableHead className="w-[110px]">
                              <span className="text-xs text-muted-foreground uppercase tracking-[0.2em]">Diff</span>
                              <span className="mt-1 block text-sm font-medium text-foreground">Abs</span>
                            </TableHead>
                          </>
                        ) : (
                          <TableHead className="w-[140px]">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-flex items-center gap-1 cursor-help">
                                  Est Traffic
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Оценочный трафик, который принесли публикации.</TooltipContent>
                            </Tooltip>
                          </TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEntities.map((entity) => {
                        const comparisonSnapshot = comparisonMetrics?.get(entity.id);
                        const ratingDiff = getDiffAbsolute(entity.rating, comparisonSnapshot?.rating ?? null);
                        const publicationsDiff = getDiffAbsolute(
                          entity.publications,
                          comparisonSnapshot?.publications ?? null
                        );
                        const lifetimeDiff = getDiffAbsolute(
                          getMetricNumericValue(entity, "avgLifetime"),
                          comparisonSnapshot?.avgLifetime ?? null
                        );
                        const trafficDiff = getDiffAbsolute(
                          getMetricNumericValue(entity, "estTraffic"),
                          comparisonSnapshot?.estTraffic ?? null
                        );

                        return (
                          <TableRow
                            key={entity.id}
                            className="cursor-pointer hover:bg-muted/60 transition-colors"
                            onClick={() => handleRowClick(entity.name)}
                          >
                            {showComparisonColumns ? (
                              <>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-semibold">{entity.rating}</span>
                                      {entity.isNew && (
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide px-2 py-0.5 border-green-200 text-green-700 bg-green-50">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                    {!entity.isNew && (
                                      <span className={`text-xs ${getTrendColor(entity.ratingChange)}`}>
                                        {formatChange(entity.ratingChange, "")}
                                      </span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-lg font-semibold">
                                    {comparisonSnapshot ? comparisonSnapshot.rating : "—"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`font-semibold ${getDiffClass(ratingDiff)}`}>
                                    {formatDiffValue(ratingDiff, "rating")}
                                  </span>
                                </TableCell>
                              </>
                            ) : (
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="text-xl font-semibold">{entity.rating}</div>
                                  {!entity.isNew && (
                                    <div className={`text-sm font-medium ${getTrendColor(entity.ratingChange)}`}>
                                      {formatChange(entity.ratingChange, "")}
                    </div>
                                  )}
                                  {entity.isNew && (
                                    <Badge variant="outline" className="text-[10px] uppercase tracking-wide px-2 py-0.5 border-green-200 text-green-700 bg-green-50">
                                      New
                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            )}

                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{entity.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {entity.category.charAt(0).toUpperCase() + entity.category.slice(1)}
                                </span>
                              </div>
                            </TableCell>

                            {showComparisonColumns ? (
                              <>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <span className="font-semibold">
                                      {numberFormatter.format(entity.publications)}
                                    </span>
                                    <span className={`text-xs ${getTrendColor(entity.publicationsChange)}`}>
                                      {formatChange(entity.publicationsChange)}
                                    </span>
                                    <MiniBarChart data={entity.publicationsTrend} />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold">
                                    {formatComparisonMetricValue(comparisonSnapshot, "publications")}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`font-semibold ${getDiffClass(publicationsDiff)}`}>
                                    {formatDiffValue(publicationsDiff, "publications")}
                                  </span>
                                </TableCell>
                              </>
                            ) : (
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="flex flex-col min-w-[72px]">
                                    <span className="font-semibold">
                                      {numberFormatter.format(entity.publications)}
                                    </span>
                                    <span className={`text-xs ${getTrendColor(entity.publicationsChange)}`}>
                                      {formatChange(entity.publicationsChange)}
                                    </span>
                                  </div>
                                  <MiniBarChart data={entity.publicationsTrend} />
                                </div>
                              </TableCell>
                            )}

                            {showComparisonColumns ? (
                              <>
                                <TableCell>
                                  <span className="font-medium">{entity.avgLifetime}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">
                                    {formatComparisonMetricValue(comparisonSnapshot, "avgLifetime")}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`font-semibold ${getDiffClass(lifetimeDiff)}`}>
                                    {formatDiffValue(lifetimeDiff, "avgLifetime")}
                                  </span>
                                </TableCell>
                              </>
                            ) : (
                              <TableCell>
                                <span className="font-medium">{entity.avgLifetime}</span>
                              </TableCell>
                            )}

                            {showComparisonColumns ? (
                              <>
                                <TableCell>
                                  <span className="font-medium">{entity.estTraffic}</span>
                                </TableCell>
                                <TableCell>
                                  <span className="font-medium">
                                    {formatComparisonMetricValue(comparisonSnapshot, "estTraffic")}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  <span className={`font-semibold ${getDiffClass(trafficDiff)}`}>
                                    {formatDiffValue(trafficDiff, "estTraffic")}
                                  </span>
                                </TableCell>
                              </>
                            ) : (
                              <TableCell>
                                <span className="font-medium">{entity.estTraffic}</span>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TooltipProvider>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
