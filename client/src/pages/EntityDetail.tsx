import { useEffect, useMemo, useRef, useState } from "react";
import { useRoute, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Plus,
  Globe,
  Link2,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

type TrackingItem = {
  type: "publisher" | "country" | "entity";
  value: string;
} | null;

type EntityPublication = {
  id: string;
  title: string;
  domain: string;
  favicon: string;
  url: string;
  category: string;
  format: string;
  country: string;
  language: string;
  publishedAt: string;
  avgPosition: number;
  lifetime: string;
  trend: string;
  badges: string[];
  entities: string[];
};

type CombinationRow = {
  label: string;
  change: string;
  volume: number;
  related: string;
};

export default function EntityDetail() {
  const [, params] = useRoute("/entity/:name");
  const [, navigate] = useLocation();
  const entityName = params?.name ? decodeURIComponent(params.name) : "";
  const displayName = entityName?.trim() ? entityName : "Discover entity";
  const tableSectionRef = useRef<HTMLDivElement | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const [filterCountry, setFilterCountry] = useState("usa");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFormat, setFilterFormat] = useState("all");
  const [filterPublisher, setFilterPublisher] = useState("all");
  const [period, setPeriod] = useState("live");
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [trackingItem, setTrackingItem] = useState<TrackingItem>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(filterCountry);

  const entityProfile = useMemo(
    () => ({
      summary: `${displayName} maintains steady visibility inside Google Discover feeds across flagship technology clusters. The data below aggregates the last 7 days of mentions split by geography and publisher.`,
      knowledgeGraphId: "kg:/m/02vxyf",
      avgLifetime: "19h 40m",
      avgLifetimeChange: "+14% vs 7d",
      rollingAvgPosition: "3.2",
      watchers: 214,
      coverageCountries: 42,
      synonyms: ["Pixel 9", "Google hardware", "Pixel camera AI"],
    }),
    [displayName]
  );

  const publisherStats = useMemo(
    () => [
      {
        domain: "techradar.com",
        favicon: "https://techradar.com/favicon.ico",
        articles: 68,
        trend: "+12%",
        sparkline: [6, 7, 8, 10, 9, 11],
        dds: 88,
      },
      {
        domain: "theverge.com",
        favicon: "https://theverge.com/favicon.ico",
        articles: 54,
        trend: "+8%",
        sparkline: [5, 6, 6, 7, 8, 9],
        dds: 83,
      },
      {
        domain: "wired.com",
        favicon: "https://wired.com/favicon.ico",
        articles: 42,
        trend: "+4%",
        sparkline: [4, 4, 5, 5, 6, 6],
        dds: 79,
      },
      {
        domain: "bloomberg.com",
        favicon: "https://bloomberg.com/favicon.ico",
        articles: 36,
        trend: "-3%",
        sparkline: [7, 6, 6, 5, 5, 4],
        dds: 81,
      },
    ],
    []
  );

  const countryStats = useMemo(
    () => [
      {
        code: "usa",
        name: "United States",
        publications: 142,
        trend: "+18%",
        share: "32%",
        sparkline: [12, 14, 15, 18, 17, 19],
      },
      {
        code: "uk",
        name: "United Kingdom",
        publications: 68,
        trend: "+9%",
        share: "16%",
        sparkline: [6, 7, 7, 8, 9, 9],
      },
      {
        code: "germany",
        name: "Germany",
        publications: 51,
        trend: "+4%",
        share: "11%",
        sparkline: [4, 5, 5, 6, 6, 7],
      },
      {
        code: "france",
        name: "France",
        publications: 37,
        trend: "-6%",
        share: "8%",
        sparkline: [5, 5, 4, 4, 3, 3],
      },
      {
        code: "russia",
        name: "Russia",
        publications: 33,
        trend: "-2%",
        share: "7%",
        sparkline: [3, 3, 4, 4, 3, 3],
      },
    ],
    []
  );

  const performanceTrend = useMemo(
    () => [
      { date: "Nov 08", publications: 12, avgPosition: 4.1 },
      { date: "Nov 09", publications: 14, avgPosition: 3.9 },
      { date: "Nov 10", publications: 18, avgPosition: 3.6 },
      { date: "Nov 11", publications: 21, avgPosition: 3.4 },
      { date: "Nov 12", publications: 24, avgPosition: 3.3 },
      { date: "Nov 13", publications: 28, avgPosition: 3.1 },
      { date: "Nov 14", publications: 26, avgPosition: 3.2 },
    ],
    []
  );

  const entityCombinations = useMemo(
    () => ({
      rising: [
        {
          label: `${displayName} + Camera AI`,
          change: "+27%",
          volume: 46,
          related: "Imaging, HDR, NightSight",
        },
        {
          label: `${displayName} + Battery saver`,
          change: "+19%",
          volume: 33,
          related: "Runtime, Pixel 9 Pro",
        },
        {
          label: `${displayName} + Gemini`,
          change: "+12%",
          volume: 21,
          related: "Assistant, Voice",
        },
      ],
      falling: [
        {
          label: `${displayName} + Foldable`,
          change: "-11%",
          volume: 14,
          related: "Pixel Fold",
        },
        {
          label: `${displayName} + Pricing leak`,
          change: "-18%",
          volume: 9,
          related: "Rumors, Launch event",
        },
        {
          label: `${displayName} + Stock issues`,
          change: "-22%",
          volume: 7,
          related: "Retailers",
        },
      ],
    }),
    [displayName]
  );

  const entityPublications = useMemo<EntityPublication[]>(
    () => [
      {
        id: "pub-1",
        title: `${displayName} camera overhaul gets longer Discover runtime`,
        domain: "techradar.com",
        favicon: "https://techradar.com/favicon.ico",
        url: "https://www.techradar.com/pixel-camera-overhaul",
        category: "technology",
        format: "article",
        country: "usa",
        language: "en",
        publishedAt: "Nov 14, 2025 03:10",
        avgPosition: 3.1,
        lifetime: "18h",
        trend: "+6%",
        badges: ["fresh"],
        entities: [displayName, "Google", "Android"],
      },
      {
        id: "pub-2",
        title: `Gemini assistant tests expand to UK ${displayName} owners`,
        domain: "theverge.com",
        favicon: "https://theverge.com/favicon.ico",
        url: "https://www.theverge.com/gemini-assistant-uk",
        category: "technology",
        format: "article",
        country: "uk",
        language: "en",
        publishedAt: "Nov 13, 2025 21:40",
        avgPosition: 3.4,
        lifetime: "22h",
        trend: "+3%",
        badges: ["trending"],
        entities: [displayName, "Gemini", "Assistant"],
      },
      {
        id: "pub-3",
        title: `${displayName} demand boosts Alphabet outlook`,
        domain: "bloomberg.com",
        favicon: "https://bloomberg.com/favicon.ico",
        url: "https://www.bloomberg.com/pixel-outlook",
        category: "finance",
        format: "analysis",
        country: "usa",
        language: "en",
        publishedAt: "Nov 13, 2025 18:05",
        avgPosition: 2.9,
        lifetime: "26h",
        trend: "+9%",
        badges: ["analysis"],
        entities: [displayName, "Alphabet", "Revenue"],
      },
      {
        id: "pub-4",
        title: `Deutsche review: warum ${displayName} 9 besser fotografiert`,
        domain: "wired.com",
        favicon: "https://wired.com/favicon.ico",
        url: "https://www.wired.com/pixel-review-de",
        category: "technology",
        format: "video",
        country: "germany",
        language: "de",
        publishedAt: "Nov 12, 2025 09:55",
        avgPosition: 3.8,
        lifetime: "16h",
        trend: "+1%",
        badges: ["localized"],
        entities: [displayName, "Camera AI", "HDR"],
      },
      {
        id: "pub-5",
        title: `${displayName} sales push in France pairs with long-read guides`,
        domain: "lemonde.fr",
        favicon: "https://lemonde.fr/favicon.ico",
        url: "https://www.lemonde.fr/pixel-guide",
        category: "technology",
        format: "listicle",
        country: "france",
        language: "fr",
        publishedAt: "Nov 11, 2025 15:10",
        avgPosition: 4.2,
        lifetime: "13h",
        trend: "-2%",
        badges: ["guide"],
        entities: [displayName, "Buying guide"],
      },
      {
        id: "pub-6",
        title: `${displayName} shipments arrive in Moscow retail`,
        domain: "sputniknews.com",
        favicon: "https://sputniknews.com/favicon.ico",
        url: "https://sputniknews.com/pixel-russia",
        category: "technology",
        format: "article",
        country: "russia",
        language: "ru",
        publishedAt: "Nov 10, 2025 11:05",
        avgPosition: 4.5,
        lifetime: "11h",
        trend: "-4%",
        badges: ["regional"],
        entities: [displayName, "Retail"],
      },
    ],
    [displayName]
  );

  const publisherOptions = useMemo(
    () => Array.from(new Set(entityPublications.map((item) => item.domain))),
    [entityPublications]
  );

  const filteredPublications = useMemo(
    () =>
      entityPublications.filter((item) => {
        if (filterCountry && item.country !== filterCountry) return false;
        if (filterLanguage !== "all" && item.language !== filterLanguage) return false;
        if (filterCategory !== "all" && item.category !== filterCategory) return false;
        if (filterFormat !== "all" && item.format !== filterFormat) return false;
        if (filterPublisher !== "all" && item.domain !== filterPublisher) return false;
        return true;
      }),
    [entityPublications, filterCountry, filterLanguage, filterCategory, filterFormat, filterPublisher]
  );

  const totalPublications = filteredPublications.length;

  const handleScrollToTable = () => {
    tableSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddToTracking = (type: NonNullable<TrackingItem>["type"], value: string) => {
    setTrackingItem({ type, value });
    setTrackingDialogOpen(true);
  };

  const handleSearch = () => {
    handleScrollToTable();
  };

  const resetFilters = () => {
    setFilterCountry("usa");
    setFilterLanguage("all");
    setFilterCategory("all");
    setFilterFormat("all");
    setFilterPublisher("all");
  };

  useEffect(() => {
    setSelectedCountry(filterCountry);
  }, [filterCountry]);

  useEffect(() => {
    if (filterPublisher === "all") {
      setSelectedPublisher(null);
    } else {
      setSelectedPublisher(filterPublisher);
    }
  }, [filterPublisher]);

  return (
    <DashboardLayout>
      <TooltipProvider delayDuration={100}>
      <div className="p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Entity detail</p>
                <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs font-semibold tracking-wide uppercase">
                KG ID: {entityProfile.knowledgeGraphId}
              </Badge>
              <Button
                size="sm"
                className="gap-2"
                onClick={() => handleAddToTracking("entity", displayName)}
              >
                <Plus className="w-4 h-4" />
                Track entity
              </Button>
            </div>
          </div>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-primary" />
                  <CardTitle className="text-base">Search parameters</CardTitle>
                </div>
                <Badge variant="secondary" className="text-xs px-3 py-1">
                  {totalPublications} results
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Mirrors Explorer filters to refine publications that mention {displayName}.
              </p>
              <div className="flex flex-wrap gap-2">
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger className="h-9 text-sm w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="russia">Russia</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue />
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

                <Select value={filterFormat} onValueChange={setFilterFormat}>
                  <SelectTrigger className="h-9 text-sm w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPublisher} onValueChange={setFilterPublisher}>
                  <SelectTrigger className="h-9 text-sm w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All publishers</SelectItem>
                    {publisherOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </div>
                    </SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Select period
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  className="h-9 bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 gap-2"
                  onClick={handleSearch}
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Entity overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                Live metrics aggregated for the last seven days of Discover snapshots.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">{entityProfile.summary}</p>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="w-4 h-4 text-primary" />
                    {entityProfile.watchers} analysts follow this entity
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entityProfile.synonyms.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-primary/10 text-primary border-0"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg lifetime</p>
                    <p className="text-xl font-semibold text-foreground">{entityProfile.avgLifetime}</p>
                    <p className="text-xs text-emerald-500 mt-1">{entityProfile.avgLifetimeChange}</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Avg position</p>
                    <p className="text-xl font-semibold text-foreground">
                      {entityProfile.rollingAvgPosition}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Last 24h window</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" />
                      Countries
                    </p>
                    <p className="text-xl font-semibold text-foreground">
                      {entityProfile.coverageCountries}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Active Discover markets</p>
                  </div>
                  <div className="rounded-lg border border-border/70 bg-background/80 p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Knowledge Graph ID
                    </p>
                    <p className="text-sm font-semibold text-foreground">{entityProfile.knowledgeGraphId}</p>
                    <p className="text-xs text-muted-foreground mt-1">Resolved via Knowledge Graph</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Top publishers</CardTitle>
                  <span className="text-xs text-muted-foreground font-medium">Publications</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {publisherStats.map((publisher) => {
                    const maxValue = Math.max(...publisher.sparkline, 1);
                    return (
                      <div
                        key={publisher.domain}
                        onClick={() => {
                          setFilterPublisher(publisher.domain);
                          setSelectedPublisher(publisher.domain);
                          handleScrollToTable();
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg border border-transparent hover:bg-muted/50 transition-colors cursor-pointer group ${
                          selectedPublisher === publisher.domain
                            ? "bg-primary/10 border border-primary/30"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleAddToTracking("publisher", publisher.domain);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                              >
                                <Plus className="w-4 h-4 text-primary" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Add publisher to tracking</TooltipContent>
                          </Tooltip>
                          <img
                            src={publisher.favicon}
                            alt=""
                            className="w-4 h-4"
                            onError={(event) => {
                              event.currentTarget.style.display = "none";
                            }}
                          />
                          <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                            {publisher.domain}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[10px] border-primary/30 text-primary font-semibold"
                          >
                            DDS {publisher.dds}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 relative">
                          <span className="text-xs text-muted-foreground font-medium w-10 text-right">
                            {publisher.articles}
                          </span>
                          <svg width="60" height="24" className="opacity-80 text-primary">
                            {publisher.sparkline.map((value, index) => (
                              <rect
                                key={`${publisher.domain}-${index}`}
                                x={index * 6}
                                y={24 - (value / maxValue) * 20}
                                width="4"
                                height={(value / maxValue) * 20}
                                rx="1"
                                fill="currentColor"
                              />
                            ))}
                          </svg>
                          <Badge
                            variant="secondary"
                            className={`text-xs w-14 justify-center ${
                              publisher.trend.startsWith("+")
                                ? "bg-accent/10 text-accent"
                                : "bg-destructive/10 text-destructive"
                            } border-0`}
                          >
                            {publisher.trend}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Top countries</CardTitle>
                  <span className="text-xs text-muted-foreground font-medium">Share of mentions</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {countryStats.map((country) => {
                    const maxValue = Math.max(...country.sparkline, 1);
                    return (
                      <div
                        key={country.code}
                        onClick={() => {
                          setFilterCountry(country.code);
                          setSelectedCountry(country.code);
                          handleScrollToTable();
                        }}
                        className={`flex items-center justify-between p-2 rounded-lg border border-transparent hover:bg-muted/50 transition-colors cursor-pointer group ${
                          selectedCountry === country.code ? "bg-primary/10 border border-primary/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleAddToTracking("country", country.name);
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                              >
                                <Plus className="w-4 h-4 text-primary" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Add country to tracking</TooltipContent>
                          </Tooltip>
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
                            {country.code.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                              {country.name}
                            </div>
                            <div className="text-xs text-muted-foreground">{country.publications} publications</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg width="60" height="24" className="opacity-80 text-primary">
                            {country.sparkline.map((value, index) => (
                              <rect
                                key={`${country.code}-${index}`}
                                x={index * 6}
                                y={24 - (value / maxValue) * 20}
                                width="4"
                                height={(value / maxValue) * 20}
                                rx="1"
                                fill="currentColor"
                              />
                            ))}
                          </svg>
                          <Badge
                            variant="secondary"
                            className={`text-xs w-14 justify-center ${
                              country.trend.startsWith("+")
                                ? "bg-accent/10 text-accent"
                                : "bg-destructive/10 text-destructive"
                            } border-0`}
                          >
                            {country.trend}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </CardContent>
        </Card>
      </div>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base">Publications and average position</CardTitle>
                  <p className="text-sm text-muted-foreground">Timeline of mentions for the last 7 days</p>
                </div>
                <Badge variant="outline" className="text-xs font-semibold tracking-wide uppercase">
                  {period === "live" ? "Live" : period}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis
                      yAxisId="pubs"
                      tick={{ fontSize: 12 }}
                      label={{ value: "Publications", angle: -90, position: "insideLeft", offset: 10 }}
                    />
                    <YAxis
                      yAxisId="pos"
                      orientation="right"
                      domain={[5, 2]}
                      tick={{ fontSize: 12 }}
                      label={{ value: "Avg position", angle: 90, position: "insideRight" }}
                    />
                    <RechartsTooltip />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      yAxisId="pubs"
                      type="monotone"
                      dataKey="publications"
                      stroke="#2563eb"
                      fill="rgba(37,99,235,0.15)"
                      strokeWidth={2}
                      name="Publications"
                    />
                    <Line
                      yAxisId="pos"
                      type="monotone"
                      dataKey="avgPosition"
                      stroke="#f97316"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name="Avg position"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div ref={tableSectionRef}>
            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="text-base">Publications mentioning {displayName}</CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={resetFilters}>
                    Reset filters
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {filteredPublications.length ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border/50">
                        <TableHead className="w-[320px] text-xs uppercase tracking-wide text-muted-foreground">
                          Article
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground">
                          Publisher
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground w-[110px]">
                          Format
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground w-[110px]">
                          Avg pos
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground w-[110px]">
                          Lifetime
                        </TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-muted-foreground w-[120px]">
                          Trend
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPublications.map((publication) => (
                        <TableRow key={publication.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell>
                            <div className="font-semibold text-sm text-foreground">{publication.title}</div>
                            <div className="text-xs text-muted-foreground">{publication.publishedAt}</div>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {publication.badges.map((badge) => (
                                <Badge key={`${publication.id}-${badge}`} variant="outline" className="text-[10px]">
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img
                                src={publication.favicon}
                                alt=""
                                className="w-4 h-4"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                              />
                              <span className="text-sm">{publication.domain}</span>
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {publication.country} / {publication.language}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize text-sm">{publication.format}</TableCell>
                          <TableCell className="text-sm font-medium">{publication.avgPosition.toFixed(1)}</TableCell>
                          <TableCell className="text-sm">{publication.lifetime}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  publication.trend.startsWith("+")
                                    ? "bg-accent/10 text-accent"
                                    : "bg-destructive/10 text-destructive"
                                } border-0`}
                              >
                                {publication.trend}
                              </Badge>
                              <a
                                href={publication.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                              >
                                <Link2 className="w-3.5 h-3.5" />
                                Open
                              </a>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Entities: {publication.entities.join(", ")}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="rounded-lg border border-dashed border-border/70 p-6 text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No publications match the current filters. Try switching country or publisher.
                    </p>
                    <Button size="sm" onClick={resetFilters}>
                      Reset filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Entity combinations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Pairings that appear with {displayName} inside Discover ranked by their change in volume.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    Rising combinations
                  </div>
                  <div className="mt-3 space-y-2">
                    {entityCombinations.rising.map((combo: CombinationRow) => (
                      <div
                        key={combo.label}
                        className="rounded-lg border border-emerald-200/60 bg-emerald-500/5 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>{combo.label}</span>
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">
                            {combo.change}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {combo.volume} publications · {combo.related}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                    <TrendingDown className="w-4 h-4" />
                    Cooling combinations
                  </div>
                  <div className="mt-3 space-y-2">
                    {entityCombinations.falling.map((combo: CombinationRow) => (
                      <div
                        key={combo.label}
                        className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 space-y-1"
                      >
                        <div className="flex items-center justify-between text-sm font-medium">
                          <span>{combo.label}</span>
                          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
                            {combo.change}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {combo.volume} publications · {combo.related}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add to tracking</DialogTitle>
              <DialogDescription>
                Configure tracking parameters for <span className="font-semibold">{trackingItem?.value}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select defaultValue="main">
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">Main project</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="competitors">Competitors</SelectItem>
                    <SelectItem value="trends">Trends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Check frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTrackingDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setTrackingDialogOpen(false);
                }}
              >
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    </DashboardLayout>
  );
}
