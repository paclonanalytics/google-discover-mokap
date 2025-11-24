import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar, Search } from "lucide-react";
import { useLocation } from "wouter";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const numberFormatter = new Intl.NumberFormat("en-US");

const COUNTRY_OPTIONS = [
  { value: "all", label: "All countries" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "spain", label: "Spain" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
] as const;

const FORMAT_OPTIONS = [
  { value: "all", label: "All formats" },
  { value: "article", label: "Article" },
  { value: "video", label: "Video" },
  { value: "analysis", label: "Analysis" },
  { value: "listicle", label: "Listicle" },
] as const;

const PERIOD_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "24h", label: "24 hours" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "custom", label: "Custom period" },
] as const;

type CategoryFlag = "trending" | "new" | "watch" | "decline" | "reliable";

type CategoryRecord = {
  id: string;
  title: string;
  emoji: string;
  description: string;
  rating: number;
  ratingChange: number;
  publications: number;
  publicationsChange: number;
  avgLifetimeHours: number;
  avgLifetimeChange: number;
  estTraffic: number;
  estTrafficChange: number;
  publicationsTrend: number[];
  formats: string[];
  countries: string[];
  languages: string[];
  periods: string[];
  topEntities: string[];
  topPublishers: string[];
  flags: CategoryFlag[];
};

const rawCategories: CategoryRecord[] = [
  {
    id: "technology",
    title: "Technology & AI",
    emoji: "🤖",
    description: "Devices, AI assistants, chipsets, robotics",
    rating: 92,
    ratingChange: 3,
    publications: 1947,
    publicationsChange: 18,
    avgLifetimeHours: 21,
    avgLifetimeChange: 2,
    estTraffic: 1_480_000,
    estTrafficChange: 12,
    publicationsTrend: [110, 125, 141, 150, 167, 189, 212, 228],
    formats: ["article", "video", "analysis"],
    countries: ["usa", "uk", "germany", "france"],
    languages: ["en", "de", "fr"],
    periods: ["live", "24h", "week", "month"],
    topEntities: ["Artificial Intelligence", "Mixed Reality", "Quantum Encryption"],
    topPublishers: ["TechCrunch", "The Verge", "Reuters"],
    flags: ["trending"],
  },
  {
    id: "finance",
    title: "Finance & Markets",
    emoji: "💸",
    description: "Digital assets, fintech, macro trends",
    rating: 88,
    ratingChange: 1,
    publications: 1820,
    publicationsChange: 11,
    avgLifetimeHours: 19,
    avgLifetimeChange: -1,
    estTraffic: 1_190_000,
    estTrafficChange: 7,
    publicationsTrend: [105, 109, 118, 120, 131, 142, 153, 167],
    formats: ["analysis", "article"],
    countries: ["usa", "uk"],
    languages: ["en"],
    periods: ["live", "24h", "week", "month"],
    topEntities: ["Decentralized Finance", "Inflation Trends", "Sovereign Bonds"],
    topPublishers: ["Bloomberg", "CoinDesk", "Financial Times"],
    flags: ["watch"],
  },
  {
    id: "health",
    title: "Health & Biotech",
    emoji: "🧬",
    description: "Biotech breakthroughs, longevity, healthcare",
    rating: 83,
    ratingChange: 4,
    publications: 1540,
    publicationsChange: 16,
    avgLifetimeHours: 24,
    avgLifetimeChange: 3,
    estTraffic: 998_000,
    estTrafficChange: 10,
    publicationsTrend: [80, 87, 93, 101, 114, 126, 133, 147],
    formats: ["article", "analysis"],
    countries: ["usa", "germany", "france"],
    languages: ["en", "de", "fr"],
    periods: ["24h", "week", "month"],
    topEntities: ["Gene Editing", "Microbiome Health", "Climate Resilience"],
    topPublishers: ["National Geographic", "Nature", "Le Monde"],
    flags: ["trending"],
  },
  {
    id: "business",
    title: "Business & Startups",
    emoji: "🚀",
    description: "Venture deals, SaaS, commerce, leadership",
    rating: 79,
    ratingChange: -1,
    publications: 1375,
    publicationsChange: -4,
    avgLifetimeHours: 17,
    avgLifetimeChange: -2,
    estTraffic: 870_000,
    estTrafficChange: -3,
    publicationsTrend: [120, 121, 119, 118, 117, 116, 110, 107],
    formats: ["article", "listicle"],
    countries: ["usa", "uk", "spain"],
    languages: ["en", "es"],
    periods: ["live", "24h", "week"],
    topEntities: ["Creator Economy", "No-Code Platforms", "Commerce Trends"],
    topPublishers: ["TechCrunch", "WSJ", "El País"],
    flags: ["decline"],
  },
  {
    id: "entertainment",
    title: "Entertainment & Culture",
    emoji: "🎬",
    description: "Streaming, celebrities, award seasons",
    rating: 76,
    ratingChange: 0,
    publications: 1254,
    publicationsChange: 6,
    avgLifetimeHours: 15,
    avgLifetimeChange: 1,
    estTraffic: 910_000,
    estTrafficChange: 5,
    publicationsTrend: [98, 100, 102, 108, 111, 118, 120, 124],
    formats: ["video", "article"],
    countries: ["usa", "uk", "france", "spain"],
    languages: ["en", "fr", "es"],
    periods: ["live", "24h", "week", "month"],
    topEntities: ["Mixed Reality", "Award Season", "Immersive Concerts"],
    topPublishers: ["BBC", "Variety", "UploadVR"],
    flags: ["watch"],
  },
  {
    id: "sustainability",
    title: "Sustainability & Climate",
    emoji: "🌱",
    description: "Energy transition, green tech, ESG",
    rating: 81,
    ratingChange: 5,
    publications: 1422,
    publicationsChange: 20,
    avgLifetimeHours: 23,
    avgLifetimeChange: 4,
    estTraffic: 1_050_000,
    estTrafficChange: 14,
    publicationsTrend: [70, 78, 86, 95, 104, 118, 126, 139],
    formats: ["analysis", "article", "video"],
    countries: ["germany", "france", "uk"],
    languages: ["en", "de", "fr"],
    periods: ["24h", "week", "month"],
    topEntities: ["Green Hydrogen", "Climate Resilience", "Renewable Energy"],
    topPublishers: ["Bloomberg", "Handelsblatt", "Le Monde"],
    flags: ["trending", "new"],
  },
  {
    id: "sports",
    title: "Sports & Performance",
    emoji: "🏅",
    description: "Major leagues, analytics, athlete brands",
    rating: 70,
    ratingChange: -2,
    publications: 1188,
    publicationsChange: -5,
    avgLifetimeHours: 11,
    avgLifetimeChange: -1,
    estTraffic: 640_000,
    estTrafficChange: -6,
    publicationsTrend: [140, 136, 132, 127, 121, 118, 110, 102],
    formats: ["video", "article"],
    countries: ["usa", "spain"],
    languages: ["en", "es"],
    periods: ["live", "24h"],
    topEntities: ["Women's Football", "Athlete Economy", "Olympic Prep"],
    topPublishers: ["ESPN", "Marca", "BBC Sport"],
    flags: ["decline"],
  },
  {
    id: "travel",
    title: "Travel & Lifestyle",
    emoji: "🧭",
    description: "Experience economy, hospitality, micro trips",
    rating: 74,
    ratingChange: 2,
    publications: 987,
    publicationsChange: 8,
    avgLifetimeHours: 18,
    avgLifetimeChange: 2,
    estTraffic: 720_000,
    estTrafficChange: 6,
    publicationsTrend: [60, 62, 65, 70, 74, 78, 81, 87],
    formats: ["listicle", "article"],
    countries: ["france", "spain", "usa"],
    languages: ["en", "fr", "es"],
    periods: ["24h", "week", "month"],
    topEntities: ["Orbital Tourism", "Slow Travel", "Nomad Visas"],
    topPublishers: ["Condé Nast", "Le Monde", "El País"],
    flags: ["new"],
  },
  {
    id: "space-economy",
    title: "Space Economy",
    emoji: "🚀",
    description: "Launch cadence, satellite clusters, orbital logistics",
    rating: 73,
    ratingChange: 2,
    publications: 934,
    publicationsChange: 7,
    avgLifetimeHours: 22,
    avgLifetimeChange: 2,
    estTraffic: 690_000,
    estTrafficChange: 5,
    publicationsTrend: [52, 58, 63, 70, 76, 83, 88, 94],
    formats: ["analysis", "article"],
    countries: ["usa", "france"],
    languages: ["en", "fr"],
    periods: ["24h", "week", "month"],
    topEntities: ["Orbital Tourism", "Battery Innovation", "Precision Medicine"],
    topPublishers: ["SpaceNews", "Le Monde", "Bloomberg"],
    flags: ["watch"],
  },
  {
    id: "gaming-culture",
    title: "Gaming Culture",
    emoji: "🎮",
    description: "Esports leagues, streaming platforms, modding scene",
    rating: 72,
    ratingChange: -1,
    publications: 1012,
    publicationsChange: -3,
    avgLifetimeHours: 13,
    avgLifetimeChange: -1,
    estTraffic: 640_000,
    estTrafficChange: -2,
    publicationsTrend: [95, 92, 90, 89, 88, 86, 84, 83],
    formats: ["video", "article"],
    countries: ["usa", "spain", "germany"],
    languages: ["en", "es", "de"],
    periods: ["live", "24h", "week"],
    topEntities: ["Esports Franchises", "Wearable Fitness", "Mixed Reality"],
    topPublishers: ["Dot Esports", "Marca", "UploadVR"],
    flags: ["decline"],
  },
  {
    id: "agritech",
    title: "AgriTech & Food",
    emoji: "🌾",
    description: "Supply chains, climate adaptation, food labs",
    rating: 75,
    ratingChange: 3,
    publications: 988,
    publicationsChange: 9,
    avgLifetimeHours: 24,
    avgLifetimeChange: 3,
    estTraffic: 710_000,
    estTrafficChange: 8,
    publicationsTrend: [60, 63, 66, 70, 76, 80, 84, 88],
    formats: ["analysis", "listicle"],
    countries: ["uk", "france", "spain"],
    languages: ["en", "fr", "es"],
    periods: ["24h", "week", "month"],
    topEntities: ["Plant-Based Food", "Water Security", "Climate Resilience"],
    topPublishers: ["Food52", "Aquatech", "National Geographic"],
    flags: ["trending"],
  },
  {
    id: "urban-mobility",
    title: "Urban Mobility",
    emoji: "🚇",
    description: "Micromobility, EV policy, city infrastructure",
    rating: 74,
    ratingChange: 1,
    publications: 1046,
    publicationsChange: 6,
    avgLifetimeHours: 18,
    avgLifetimeChange: 1,
    estTraffic: 760_000,
    estTrafficChange: 4,
    publicationsTrend: [82, 84, 88, 92, 95, 99, 102, 106],
    formats: ["article", "analysis"],
    countries: ["germany", "france", "usa"],
    languages: ["de", "fr", "en"],
    periods: ["live", "24h", "week", "month"],
    topEntities: ["Autonomous Logistics", "Supply Chain AI", "5G Infrastructure"],
    topPublishers: ["CityLab", "Logistics Insider", "GSMArena"],
    flags: ["watch"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    emoji: "🛡️",
    description: "Threat intelligence, zero trust, national cyber policy",
    rating: 82,
    ratingChange: 2,
    publications: 1320,
    publicationsChange: 12,
    avgLifetimeHours: 16,
    avgLifetimeChange: 2,
    estTraffic: 980_000,
    estTrafficChange: 9,
    publicationsTrend: [110, 112, 118, 120, 128, 132, 139, 145],
    formats: ["analysis", "article"],
    countries: ["usa", "uk", "germany"],
    languages: ["en", "de"],
    periods: ["live", "24h", "week"],
    topEntities: ["Cyber Defense Systems", "Quantum Encryption", "Supply Chain AI"],
    topPublishers: ["Darktrace Labs", "The Economist", "Supply Chain Dive"],
    flags: ["trending", "reliable"],
  },
  {
    id: "creator-economy",
    title: "Creator Economy",
    emoji: "📱",
    description: "Short-form, live commerce, individual brands",
    rating: 71,
    ratingChange: 0,
    publications: 874,
    publicationsChange: 5,
    avgLifetimeHours: 14,
    avgLifetimeChange: 1,
    estTraffic: 540_000,
    estTrafficChange: 3,
    publicationsTrend: [65, 67, 69, 70, 72, 74, 76, 78],
    formats: ["video", "article"],
    countries: ["usa", "spain"],
    languages: ["en", "es"],
    periods: ["live", "24h", "week"],
    topEntities: ["Creator Economy", "Athlete Economy", "Immersive Concerts"],
    topPublishers: ["TechCrunch", "Variety", "Marca"],
    flags: ["watch"],
  },
  {
    id: "medtech",
    title: "MedTech Systems",
    emoji: "🏥",
    description: "Clinical AI, hospital infrastructure, diagnostics",
    rating: 80,
    ratingChange: 3,
    publications: 1186,
    publicationsChange: 13,
    avgLifetimeHours: 25,
    avgLifetimeChange: 4,
    estTraffic: 900_000,
    estTrafficChange: 8,
    publicationsTrend: [75, 78, 82, 88, 95, 101, 108, 115],
    formats: ["analysis", "article"],
    countries: ["usa", "france", "germany"],
    languages: ["en", "fr", "de"],
    periods: ["24h", "week", "month"],
    topEntities: ["Precision Medicine", "Metabolic Health", "Gene Editing"],
    topPublishers: ["Stat News", "Healthline", "Nature"],
    flags: ["trending"],
  },
  {
    id: "energy-storage",
    title: "Energy Storage",
    emoji: "🔋",
    description: "Battery pipelines, grid-scale storage, materials",
    rating: 78,
    ratingChange: 4,
    publications: 1115,
    publicationsChange: 15,
    avgLifetimeHours: 21,
    avgLifetimeChange: 3,
    estTraffic: 860_000,
    estTrafficChange: 10,
    publicationsTrend: [66, 70, 75, 80, 86, 93, 100, 108],
    formats: ["analysis", "article"],
    countries: ["germany", "france", "uk"],
    languages: ["de", "fr", "en"],
    periods: ["24h", "week", "month"],
    topEntities: ["Battery Innovation", "Supply Chain AI", "Green Hydrogen"],
    topPublishers: ["Energy Storage News", "InsideEVs", "Bloomberg"],
    flags: ["trending", "reliable"],
  },
  {
    id: "climate-policy",
    title: "Climate Policy",
    emoji: "🏛️",
    description: "Net-zero laws, ESG disclosure, finance frameworks",
    rating: 77,
    ratingChange: 1,
    publications: 970,
    publicationsChange: 6,
    avgLifetimeHours: 23,
    avgLifetimeChange: 2,
    estTraffic: 780_000,
    estTrafficChange: 5,
    publicationsTrend: [55, 58, 61, 64, 68, 73, 78, 82],
    formats: ["analysis", "article"],
    countries: ["uk", "france", "germany"],
    languages: ["en", "fr", "de"],
    periods: ["24h", "week", "month"],
    topEntities: ["Climate Resilience", "Water Security", "Green Hydrogen"],
    topPublishers: ["Bloomberg", "Aquatech", "National Geographic"],
    flags: ["watch"],
  },
  {
    id: "data-privacy",
    title: "Data Privacy",
    emoji: "🧩",
    description: "Regulation, consent layers, browser changes",
    rating: 74,
    ratingChange: -1,
    publications: 840,
    publicationsChange: -2,
    avgLifetimeHours: 19,
    avgLifetimeChange: -1,
    estTraffic: 620_000,
    estTrafficChange: -3,
    publicationsTrend: [68, 67, 66, 65, 64, 63, 61, 60],
    formats: ["analysis", "article"],
    countries: ["usa", "uk"],
    languages: ["en"],
    periods: ["live", "24h", "week"],
    topEntities: ["Data Governance", "Zero Trust", "Secure AI"],
    topPublishers: ["The Information", "Darktrace Labs", "Supply Chain Dive"],
    flags: ["decline"],
  },
  {
    id: "automation",
    title: "Automation & Robotics",
    emoji: "🤖",
    description: "Industrial robotics, RPA, manufacturing software",
    rating: 79,
    ratingChange: 2,
    publications: 1150,
    publicationsChange: 10,
    avgLifetimeHours: 20,
    avgLifetimeChange: 2,
    estTraffic: 830_000,
    estTrafficChange: 7,
    publicationsTrend: [100, 101, 103, 107, 112, 118, 124, 129],
    formats: ["article", "analysis"],
    countries: ["usa", "germany", "japan"],
    languages: ["en", "de"],
    periods: ["live", "24h", "week", "month"],
    topEntities: ["Supply Chain AI", "Autonomous Logistics", "Smart Manufacturing"],
    topPublishers: ["Automation World", "Industry Week", "MIT Tech Review"],
    flags: ["trending"],
  },
  {
    id: "digital-health",
    title: "Digital Health",
    emoji: "📲",
    description: "Telemedicine, wearables, remote diagnostics",
    rating: 81,
    ratingChange: 3,
    publications: 1240,
    publicationsChange: 11,
    avgLifetimeHours: 19,
    avgLifetimeChange: 1,
    estTraffic: 910_000,
    estTrafficChange: 6,
    publicationsTrend: [70, 72, 75, 79, 84, 88, 94, 101],
    formats: ["article", "analysis", "video"],
    countries: ["usa", "uk", "france"],
    languages: ["en", "fr"],
    periods: ["24h", "week", "month"],
    topEntities: ["Wearable Fitness", "Metabolic Health", "Precision Medicine"],
    topPublishers: ["Runner's World", "Healthline", "Nature"],
    flags: ["trending", "reliable"],
  },
  {
    id: "web3-infrastructure",
    title: "Web3 Infrastructure",
    emoji: "🪙",
    description: "Protocols, wallets, regulation, staking",
    rating: 70,
    ratingChange: -2,
    publications: 920,
    publicationsChange: -6,
    avgLifetimeHours: 15,
    avgLifetimeChange: -1,
    estTraffic: 580_000,
    estTrafficChange: -5,
    publicationsTrend: [90, 88, 85, 82, 79, 75, 70, 66],
    formats: ["analysis", "article"],
    countries: ["usa", "uk"],
    languages: ["en"],
    periods: ["live", "24h", "week"],
    topEntities: ["Decentralized Finance", "Digital Engineering", "Automation World"],
    topPublishers: ["CoinDesk", "Financial Times", "MIT Tech Review"],
    flags: ["decline"],
  },
  {
    id: "supply-chain",
    title: "Supply Chain",
    emoji: "🚢",
    description: "Ports, logistics, procurement digitization",
    rating: 78,
    ratingChange: 1,
    publications: 1105,
    publicationsChange: 7,
    avgLifetimeHours: 17,
    avgLifetimeChange: 1,
    estTraffic: 770_000,
    estTrafficChange: 4,
    publicationsTrend: [88, 89, 90, 91, 93, 96, 98, 100],
    formats: ["article", "analysis"],
    countries: ["usa", "germany", "france"],
    languages: ["en", "de", "fr"],
    periods: ["24h", "week", "month"],
    topEntities: ["Supply Chain AI", "Autonomous Logistics", "Water Security"],
    topPublishers: ["Supply Chain Dive", "Logistics Insider", "Aquatech"],
    flags: ["watch"],
  },
];

const PAGE_SIZE = 20;

const formatChange = (value: number, suffix = "%") =>
  `${value > 0 ? "+" : value < 0 ? "" : ""}${value}${suffix}`;

const getTrendClass = (value: number) => {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-muted-foreground";
};

const formatLifetime = (hours: number) => `${Math.round(hours)}h`;

const formatTraffic = (value: number) => {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  return `${Math.round(value / 1_000)}K`;
};

export default function Categories() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState<(typeof COUNTRY_OPTIONS)[number]["value"]>("all");
  const [language, setLanguage] =
    useState<(typeof LANGUAGE_OPTIONS)[number]["value"]>("all");
  const [format, setFormat] = useState<(typeof FORMAT_OPTIONS)[number]["value"]>("all");
  const [period, setPeriod] = useState<(typeof PERIOD_OPTIONS)[number]["value"]>("live");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const filterSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (period !== "custom") {
      setCustomPopoverOpen(false);
    }
  }, [period]);

  useEffect(() => {
    const mainContainer = document.querySelector("main");
    if (!mainContainer) return;

    const handleScroll = () => {
      if (!filterSectionRef.current) return;
      const { bottom } = filterSectionRef.current.getBoundingClientRect();
      setShowStickyFilters(bottom <= -10);
    };

    handleScroll();
    mainContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => mainContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredCategories = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return rawCategories.filter((category) => {
      if (country !== "all" && !category.countries.includes(country)) return false;
      if (language !== "all" && !category.languages.includes(language)) return false;
      if (format !== "all" && !category.formats.includes(format)) return false;
      if (period !== "custom" && period !== "live" && !category.periods.includes(period))
        return false;

      if (search.length > 0) {
        const haystack = [
          category.title,
          category.description,
          ...category.topEntities,
          ...category.topPublishers,
        ].join(" ").toLowerCase();
        if (!haystack.includes(search)) return false;
      }

      return true;
    });
  }, [country, language, format, period, searchQuery]);

  const sortedCategories = useMemo(() => {
    const copy = [...filteredCategories];
    copy.sort((a, b) => a.rating - b.rating);
    return copy;
  }, [filteredCategories]);

  const totalPages = Math.max(1, Math.ceil(sortedCategories.length / PAGE_SIZE));
  const paginatedCategories = useMemo(
    () =>
      sortedCategories.slice(
        (currentPage - 1) * PAGE_SIZE,
        (currentPage - 1) * PAGE_SIZE + PAGE_SIZE
      ),
    [sortedCategories, currentPage]
  );

  const periodLabel =
    period === "custom"
      ? customRange?.from && customRange?.to
        ? `${customRange.from.toLocaleDateString()} – ${customRange.to.toLocaleDateString()}`
        : "Select range"
      : PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "Period";

  const handleNavigate = (category: CategoryRecord) => {
    navigate(`/category/${encodeURIComponent(category.id)}`);
  };

  return (
    <DashboardLayout
      showStickyFilters={showStickyFilters}
      filterCountry={country}
      setFilterCountry={(value) => {
        setCountry(value);
        setCurrentPage(1);
      }}
      filterLanguage={language}
      setFilterLanguage={(value) => {
        setLanguage(value);
        setCurrentPage(1);
      }}
      filterCategory="all"
      setFilterCategory={() => {}}
      filterFormat={format}
      setFilterFormat={(value) => {
        setFormat(value);
        setCurrentPage(1);
      }}
      period={period}
      setPeriod={(value) => {
        setPeriod(value);
        setCurrentPage(1);
      }}
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Discover Explorer
            </p>
            <h1 className="text-3xl font-bold text-foreground mt-2">Categories</h1>
            <p className="text-muted-foreground mt-1">
              Monitor how thematic clusters perform across Google Discover markets.
            </p>
          </div>
        </div>

        <div
          ref={filterSectionRef}
          className="border border-border shadow-sm rounded-lg bg-card"
        >
          <div className="py-4 px-6 space-y-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories or entities"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={country}
                onValueChange={(value) => {
                  setCountry(value as typeof country);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
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

              <Select
                value={language}
                onValueChange={(value) => {
                  setLanguage(value as typeof language);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
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

              <Select
                value={format}
                onValueChange={(value) => {
                  setFormat(value as typeof format);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {FORMAT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={period}
                onValueChange={(value) => {
                  setPeriod(value as typeof period);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  {PERIOD_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {period === "custom" && (
                <Popover open={customPopoverOpen} onOpenChange={setCustomPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-[220px] justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {periodLabel}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <CalendarComponent
                      mode="range"
                      numberOfMonths={2}
                      selected={customRange}
                      onSelect={setCustomRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle>Category leaderboard</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedCategories.length} of {sortedCategories.length} categories
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {periodLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {sortedCategories.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Нет категорий, удовлетворяющих выбранным фильтрам
              </div>
            ) : (
              <TooltipProvider delayDuration={150}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[240px]">Category</TableHead>
                      <TableHead className="w-[140px]">Rating</TableHead>
                      <TableHead className="w-[180px]">Publications</TableHead>
                      <TableHead className="w-[160px]">Avg Lifetime</TableHead>
                      <TableHead className="w-[160px]">Est. Traffic</TableHead>
                      <TableHead className="w-[220px]">Top entities</TableHead>
                      <TableHead className="w-[220px]">Lead publishers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCategories.map((category) => (
                      <TableRow
                        key={category.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleNavigate(category)}
                      >
                        <TableCell className="align-top">
                          <span className="font-semibold text-base">{category.title}</span>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold">{category.rating}</span>
                            <span className={`text-xs ${getTrendClass(category.ratingChange)}`}>
                              {category.ratingChange > 0 ? "+" : ""}
                              {category.ratingChange} pt
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold">
                              {numberFormatter.format(category.publications)}
                            </span>
                            <span
                              className={`text-xs ${getTrendClass(category.publicationsChange)}`}
                            >
                              {formatChange(category.publicationsChange)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold">
                              {formatLifetime(category.avgLifetimeHours)}
                            </span>
                            <span
                              className={`text-xs ${getTrendClass(category.avgLifetimeChange)}`}
                            >
                              {formatChange(category.avgLifetimeChange)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold">
                              {formatTraffic(category.estTraffic)}
                            </span>
                            <span
                              className={`text-xs ${getTrendClass(category.estTrafficChange)}`}
                            >
                              {formatChange(category.estTrafficChange)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {category.topEntities.map((entity) => (
                              <Badge key={entity} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="align-top">
                          <div className="flex flex-wrap gap-1.5">
                            {category.topPublishers.map((publisher) => (
                              <Badge key={publisher} variant="secondary" className="text-xs">
                                {publisher}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TooltipProvider>
            )}

            {sortedCategories.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-2 py-4 border-t border-border/50 mt-2">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
