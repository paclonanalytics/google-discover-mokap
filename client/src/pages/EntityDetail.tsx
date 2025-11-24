import React, { useState, useMemo, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import {
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Flame,
  Sparkles,
  Repeat,
  TrendingUp,
  Filter,
  Download,
  Plus,
} from "lucide-react";
import { DateRange } from "react-day-picker";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { mockPublications } from "@/data/mock-publications";
import {
  risingCoOccurrences,
  fallingCoOccurrences,
  type CoOccurrence,
} from "@/data/co-occurrences";

// Mock Data Constants
const COUNTRY_OPTIONS = [
  { value: "worldwide", label: "Worldwide" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "canada", label: "Canada" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ru", label: "Russian" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
];

const PERIOD_OPTIONS = [
  { value: "1m", label: "1 month" },
  { value: "1w", label: "1 week" },
  { value: "24h", label: "24 hours" },
  { value: "custom", label: "Custom period" },
];

type SeriesKey = "allPublications" | "newPublications" | "traffic" | "position";

// Mock Data Generators
const generateChartData = (multiplier = 1) => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `2024-11-${String(i + 1).padStart(2, "0")}`,
    allPublications: Math.floor((Math.random() * 40 + 10) * multiplier),
    newPublications: Math.floor((Math.random() * 10) * multiplier),
    traffic: Math.floor((Math.random() * 50000 + 10000) * multiplier),
    position: parseFloat((Math.random() * 3 + 2).toFixed(2)),
  }));
};

const baseTopCountries = [
  { country: "USA", value: "usa", emoji: "🇺🇸", publications: 1250, pubChange: 12, traffic: "2.5M" },
  { country: "UK", value: "uk", emoji: "🇬🇧", publications: 850, pubChange: 5, traffic: "1.2M" },
  { country: "Germany", value: "germany", emoji: "🇩🇪", publications: 620, pubChange: -2, traffic: "850K" },
  { country: "France", value: "france", emoji: "🇫🇷", publications: 450, pubChange: 8, traffic: "620K" },
  { country: "Canada", value: "canada", emoji: "🇨🇦", publications: 320, pubChange: 15, traffic: "450K" },
];

const topCountries = [
  { country: "Worldwide", value: "worldwide", emoji: "🌍", publications: 3600, pubChange: 7, traffic: "5.7M" },
  ...baseTopCountries.slice(0, 4),
];

const topPublishers = [
  {
    name: "TechCrunch",
    domain: "techcrunch.com",
    favicon: "https://www.google.com/s2/favicons?domain=techcrunch.com",
    publications: 420,
    estTraffic: "1.4M",
    dds: 94,
    mainCategory: "Technology",
    avgPosition: 2.1,
  },
  {
    name: "The Verge",
    domain: "theverge.com",
    favicon: "https://www.google.com/s2/favicons?domain=theverge.com",
    publications: 365,
    estTraffic: "1.1M",
    dds: 91,
    mainCategory: "Consumer Tech",
    avgPosition: 2.8,
  },
  {
    name: "Reuters",
    domain: "reuters.com",
    favicon: "https://www.google.com/s2/favicons?domain=reuters.com",
    publications: 330,
    estTraffic: "950K",
    dds: 89,
    mainCategory: "Business",
    avgPosition: 3.0,
  },
  {
    name: "BBC News",
    domain: "bbc.com",
    favicon: "https://www.google.com/s2/favicons?domain=bbc.com",
    publications: 310,
    estTraffic: "870K",
    dds: 87,
    mainCategory: "World",
    avgPosition: 3.4,
  },
  {
    name: "Bloomberg",
    domain: "bloomberg.com",
    favicon: "https://www.google.com/s2/favicons?domain=bloomberg.com",
    publications: 295,
    estTraffic: "820K",
    dds: 90,
    mainCategory: "Finance",
    avgPosition: 2.9,
  },
];

// Utility Components
const TrendIndicator = ({ value }: { value: number }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  if (isNeutral) return <span className="text-muted-foreground">0%</span>;

  return (
    <span className={`flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
      {isPositive ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
      {Math.abs(value)}%
    </span>
  );
};

const MetricCard = ({ title, value, prevValue, unit = "" }: { title: string; value: number | string; prevValue: number | string; unit?: string }) => {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : value;
  const numPrevValue = typeof prevValue === 'string' ? parseFloat(prevValue.replace(/[^0-9.-]+/g, "")) : prevValue;
  
  const diff = typeof numValue === 'number' && typeof numPrevValue === 'number' && numPrevValue !== 0
    ? Math.round(((numValue - numPrevValue) / numPrevValue) * 100)
    : 0;

  return (
    <Card className="border border-border shadow-sm">
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold">{value}{unit}</span>
            <div className="mb-1">
              <TrendIndicator value={diff} />
            </div>
          </div>
          <span className="text-xs text-muted-foreground">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default function EntityDetail() {
  const [, params] = useRoute("/entity/:name");
  const [, navigate] = useLocation();
  const entityName = params?.name ? decodeURIComponent(params.name) : "Unknown Entity";
  const entityId = entityName.toLowerCase().replace(/\s+/g, '-');

  // State
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [filterCountry, setFilterCountry] = useState("worldwide");
  const [filterLanguage, setFilterLanguage] = useState("en");
  const [filterPeriod, setFilterPeriod] = useState("1m");
  const [filterBadges, setFilterBadges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  const pageSize = 20;
  const comboPageSize = 4;
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [risingPage, setRisingPage] = useState(1);
  const [fallingPage, setFallingPage] = useState(1);
  const [relatedEntities] = useState(["Artificial Intelligence", "Spatial Computing", "Mixed Reality"]);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState("project-1");
  const [contentTab, setContentTab] = useState<"publications" | "publishers">("publications");
  const [visibleSeries, setVisibleSeries] = useState<Record<SeriesKey, boolean>>({
    allPublications: true,
    newPublications: true,
    traffic: true,
    position: true,
  });

  useEffect(() => {
    if (filterPeriod !== "custom") {
      setCustomPopoverOpen(false);
    }
  }, [filterPeriod]);

  useEffect(() => {
    if (filterPeriod === "custom" && !customRange?.from && !customRange?.to) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 6);
      setCustomRange({ from: start, to: end });
    }
  }, [filterPeriod, customRange]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCountry, filterBadges]);

  // Derived Data with Filtering
  const filteredPublications = useMemo(() => {
    return mockPublications.filter(pub => {
      // Country Filter
      if (filterCountry !== "worldwide") {
        const countryMap: Record<string, string> = {
          "usa": "USA",
          "uk": "UK",
          "germany": "Germany",
          "france": "France",
          "canada": "Canada",
        };
        if (pub.country !== countryMap[filterCountry]) return false;
      }
      
      // Badge/Quick Filters
      if (filterBadges.length > 0) {
        if (!filterBadges.some(badge => pub.badges.includes(badge))) return false;
      }
      
      return true;
    });
  }, [filterCountry, filterBadges]);

  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPublications.slice(start, start + pageSize);
  }, [currentPage, filteredPublications]);

  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / pageSize));

  // Dynamic Metrics based on filtered data
  const metrics = useMemo(() => {
    const totalPubs = filteredPublications.length;
    const totalTraffic = filteredPublications.reduce((acc, pub) => {
      const val = parseFloat(pub.estTraffic);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    
    const avgPos = filteredPublications.length > 0
      ? (filteredPublications.reduce((acc, pub) => acc + pub.avgPosition, 0) / filteredPublications.length).toFixed(1)
      : "0.0";

    const avgLife = filteredPublications.length > 0
      ? Math.round(filteredPublications.reduce((acc, pub) => acc + parseInt(pub.lifetime), 0) / filteredPublications.length)
      : 0;

    return {
      publications: totalPubs,
      traffic: totalTraffic.toFixed(1) + "K",
      avgLifetime: avgLife + "h",
      avgPosition: avgPos
    };
  }, [filteredPublications]);

  const customRangeDays = useMemo(() => {
    if (filterPeriod !== "custom" || !customRange?.from || !customRange?.to) return null;
    const diffMs = customRange.to.getTime() - customRange.from.getTime();
    if (diffMs <= 0) return 1;
    return Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
  }, [filterPeriod, customRange]);

  const customRangeLabel = useMemo(() => {
    if (!customRange?.from || !customRange?.to) return "Select dates";
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
    return `${formatter.format(customRange.from)} – ${formatter.format(customRange.to)}`;
  }, [customRange]);

  const multiplier = useMemo(() => {
    const countryMultiplier = filterCountry === "worldwide" ? 1 : 0.3;
    const periodMultiplier =
      customRangeDays !== null
        ? Math.min(1, Math.max(0.25, customRangeDays / 30))
        : 1;
    return countryMultiplier * periodMultiplier;
  }, [filterCountry, customRangeDays]);

  // Simulate chart data changes based on filter
  const chartData = useMemo(() => generateChartData(multiplier), [multiplier]);

  const chartConfig = {
    allPublications: {
      label: "All Publications",
      color: "var(--primary)",
    },
    newPublications: {
      label: "New Publications",
      color: "var(--chart-2)",
    },
    traffic: {
      label: "Est. Traffic",
    color: "hsl(14 90% 60%)",
    },
    position: {
      label: "Position",
    color: "hsl(280 80% 60%)",
    },
  } satisfies ChartConfig;

  const risingTotalPages = Math.max(1, Math.ceil(risingCoOccurrences.length / comboPageSize));
  const fallingTotalPages = Math.max(1, Math.ceil(fallingCoOccurrences.length / comboPageSize));

  const risingSlice = useMemo(
    () =>
      risingCoOccurrences.slice(
        (risingPage - 1) * comboPageSize,
        risingPage * comboPageSize
      ),
    [risingPage]
  );

  const fallingSlice = useMemo(
    () =>
      fallingCoOccurrences.slice(
        (fallingPage - 1) * comboPageSize,
        fallingPage * comboPageSize
      ),
    [fallingPage]
  );

  useEffect(() => {
    setRisingPage((prev) => Math.min(prev, risingTotalPages));
  }, [risingTotalPages]);

  useEffect(() => {
    setFallingPage((prev) => Math.min(prev, fallingTotalPages));
  }, [fallingTotalPages]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const handleTopCountryClick = (countryValue: string) => {
    setFilterCountry(countryValue);
  };

  const toggleSeries = (key: SeriesKey) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePublicationClick = (publicationId: string) => {
    navigate(`/article/${encodeURIComponent(publicationId)}`);
  };

  const handlePublisherClick = (event: React.MouseEvent, publisher: string) => {
    event.stopPropagation();
    navigate(`/publisher/${encodeURIComponent(publisher)}`);
  };

  const handleCategoryClick = (event: React.MouseEvent, category: string) => {
    event.stopPropagation();
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const handleEntityClick = (event: React.MouseEvent, entity: string) => {
    event.stopPropagation();
    navigate(`/entity/${encodeURIComponent(entity)}`);
  };

  const handleCombinationClick = (comboId: string) => {
    const params = new URLSearchParams({ entity: entityName });
    navigate(`/combination/${comboId}?${params.toString()}`);
  };

  const handlePublisherRowClick = (domain: string) => {
    navigate(`/publisher/${encodeURIComponent(domain)}`);
  };

  const getSeriesColor = (key: SeriesKey) => chartConfig[key]?.color ?? "var(--primary)";

  const formatValueWithDelta = (value: number, delta: number) => {
    const formattedValue = value.toLocaleString();
    const formattedDelta = `${delta >= 0 ? "+" : ""}${delta}%`;
    const deltaClass =
      delta > 0 ? "text-green-600" : delta < 0 ? "text-red-600" : "text-muted-foreground";

    return (
      <div className="text-right font-semibold leading-tight">
        {formattedValue}
        <span className={`ml-2 text-xs font-medium ${deltaClass}`}>({formattedDelta})</span>
      </div>
    );
  };

  return (
    <DashboardLayout
      showStickyFilters={false}
      filterCountry={filterCountry}
      setFilterCountry={setFilterCountry}
      filterLanguage={filterLanguage}
      setFilterLanguage={setFilterLanguage}
      filterCategory="all"
      setFilterCategory={() => {}}
      filterFormat="all"
      setFilterFormat={() => {}}
      filterPublisher="all"
      setFilterPublisher={() => {}}
      period={filterPeriod}
      setPeriod={setFilterPeriod}
      publisherOptions={[]}
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Block 1: Entity Overview */}
        <Card className="border border-border shadow-sm">
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-foreground">{entityName}</h1>
                    <Badge variant="outline" className="text-xs font-mono">ID: {entityId}</Badge>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">Event</Badge>
                    <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add to Tracking
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add {entityName} to tracking</DialogTitle>
                          <DialogDescription>Select one of your projects.</DialogDescription>
                        </DialogHeader>
                        <RadioGroup
                          value={selectedProject}
                          onValueChange={setSelectedProject}
                          className="space-y-3"
                        >
                          {[
                            { id: "project-1", name: "Product Launch", desc: "Monitoring tech launches" },
                            { id: "project-2", name: "Emerging Markets", desc: "Track fast growing GEOs" },
                            { id: "project-3", name: "AI Spotlight", desc: "All AI related topics" },
                          ].map((project) => (
                            <Label
                              key={project.id}
                              htmlFor={project.id}
                              className="flex items-center justify-between rounded-lg border border-border p-3 cursor-pointer hover:border-primary"
                            >
                              <div className="space-y-1">
                                <div className="text-sm font-medium leading-none">{project.name}</div>
                                <div className="text-xs text-muted-foreground">{project.desc}</div>
                              </div>
                              <RadioGroupItem value={project.id} id={project.id} />
                            </Label>
                          ))}
                        </RadioGroup>
                        <DialogFooter>
                          <Button onClick={() => setTrackingDialogOpen(false)}>Add</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={filterCountry} onValueChange={setFilterCountry}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      {PERIOD_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  {filterPeriod === "custom" && (
                    <Popover open={customPopoverOpen} onOpenChange={setCustomPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-[220px] h-9 text-sm justify-between"
                        >
                          <span>{customRangeLabel}</span>
                          <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          numberOfMonths={2}
                          selected={customRange}
                          onSelect={(range) => {
                            setCustomRange(range);
                            if (range?.from && range?.to) {
                              setCustomPopoverOpen(false);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>

              {/* Description */}
              <Collapsible open={descriptionOpen} onOpenChange={setDescriptionOpen}>
                <div className="space-y-2">
                  <p className={`text-muted-foreground text-sm leading-relaxed ${!descriptionOpen ? "line-clamp-2" : ""}`}>
                    This entity represents a significant topic in the current news cycle. Tracking data suggests increasing interest across multiple regions.
                    The description provides context about the entity, its classification, and why it is currently trending. 
                    Detailed analysis shows correlation with other major events and persistent coverage over the selected period.
                  </p>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-0 text-primary hover:text-primary/80 hover:bg-transparent">
                      {descriptionOpen ? (
                        <>Show less <ChevronUp className="ml-1 w-3 h-3" /></>
                      ) : (
                        <>Read more <ChevronDown className="ml-1 w-3 h-3" /></>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </Collapsible>

              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Related entities:</span>
                {relatedEntities.map((related) => (
                  <Badge
                    key={related}
                    variant="outline"
                    className="text-xs border-dashed hover:bg-primary/10 cursor-pointer"
                    onClick={() => navigate(`/entity/${encodeURIComponent(related)}`)}
                  >
                    {related}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Block 2: Metrics and Charts */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard title="Publications" value={metrics.publications} prevValue={11000} />
            <MetricCard title="Est. Traffic" value={metrics.traffic} prevValue="1.8M" />
            <MetricCard title="Avg Lifetime" value={metrics.avgLifetime} prevValue="20h" />
            <MetricCard title="Avg Position" value={metrics.avgPosition} prevValue="4.2" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 lg:col-span-2 border border-border shadow-sm">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-base font-semibold">Dynamics</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(chartConfig) as SeriesKey[]).map((key) => {
                      const config = chartConfig[key];
                      const isActive = visibleSeries[key];
                      const color = getSeriesColor(key);
                      return (
                        <Button
                          key={key}
                          variant={isActive ? "default" : "outline"}
                          size="sm"
                          className="h-8 text-xs capitalize"
                          style={{
                            backgroundColor: isActive ? color : undefined,
                            color: isActive ? "var(--primary-foreground)" : color,
                            borderColor: color,
                          }}
                          onClick={() => toggleSeries(key)}
                        >
                          {config.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-1">
                <div className="h-[300px] w-full">
                  <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                        <XAxis 
                          dataKey="date" 
                          tickLine={false} 
                          axisLine={false} 
                          tickMargin={10} 
                          minTickGap={32}
                          tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          style={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis 
                          yAxisId="left"
                          tickLine={false} 
                          axisLine={false} 
                          style={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tickLine={false} 
                          axisLine={false}
                          style={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                        />
                        <YAxis
                          yAxisId="position"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          domain={[1, 6]}
                          hide
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        
                        {visibleSeries.allPublications && (
                          <Bar yAxisId="left" dataKey="allPublications" stackId="a" fill="var(--color-allPublications)" radius={[0, 0, 4, 4]} />
                        )}
                        {visibleSeries.newPublications && (
                          <Bar yAxisId="left" dataKey="newPublications" stackId="a" fill="var(--color-newPublications)" radius={[4, 4, 0, 0]} />
                        )}
                        {visibleSeries.traffic && (
                          <Line type="monotone" dataKey="traffic" stroke="var(--color-traffic)" strokeWidth={2} dot={false} yAxisId="right" />
                        )}
                        {visibleSeries.position && (
                          <Line type="monotone" dataKey="position" stroke="var(--color-position)" strokeWidth={2} dot={false} yAxisId="position" />
                        )}
                      </ComposedChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Top Countries</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead className="h-9 text-xs">Country</TableHead>
                      <TableHead className="h-9 text-xs text-right">Publications</TableHead>
                      <TableHead className="h-9 text-xs text-right">Est. Traffic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCountries.map((country) => (
                      <TableRow 
                        key={country.country} 
                        className={`border-border/50 cursor-pointer transition-colors hover:bg-muted/50 ${filterCountry === country.value ? "bg-muted/50" : ""}`}
                        onClick={() => handleTopCountryClick(country.value)}
                      >
                        <TableCell className="py-2.5">
                          <span className="flex items-center gap-2 font-medium">
                            <span className="text-lg">{country.emoji}</span>
                            {country.country}
                          </span>
                        </TableCell>
                        <TableCell className="py-2.5 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold">{country.publications}</span>
                            <span className={`text-[10px] ${country.pubChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {country.pubChange > 0 ? '+' : ''}{country.pubChange}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-2.5 text-right font-medium">{country.traffic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Block 3: Publications Table */}
        <Card className="border border-border shadow-sm">
          <Tabs
            value={contentTab}
            onValueChange={(value) => setContentTab(value as "publications" | "publishers")}
            className="flex flex-col"
          >
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Publications & Publishers</CardTitle>
                <TabsList className="w-fit">
                  <TabsTrigger value="publications">
                    Publications
                  </TabsTrigger>
                  <TabsTrigger value="publishers">
                    Top publishers
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {contentTab === "publications" && (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 mr-2">
                    {[
                      { key: "new", label: "New", icon: Sparkles, tooltip: "Show newly created articles" },
                      { key: "trending", label: "Trending", icon: Flame, tooltip: "Show articles gaining momentum" },
                      { key: "wide_geo", label: "Wide GEO", icon: TrendingUp, tooltip: "Show articles with wide geographic coverage" },
                      { key: "reappeared", label: "Reappeared", icon: Repeat, tooltip: "Show articles that reappeared recently" },
                    ].map(badge => (
                      <TooltipProvider key={badge.key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={filterBadges.includes(badge.key) ? "default" : "outline"}
                              size="sm"
                              className={`h-8 text-xs flex items-center gap-1.5 ${filterBadges.includes(badge.key) ? "" : "text-muted-foreground hover:text-foreground"}`}
                              onClick={() => {
                                setFilterBadges(prev =>
                                  prev.includes(badge.key)
                                    ? prev.filter(b => b !== badge.key)
                                    : [...prev, badge.key]
                                );
                                setCurrentPage(1);
                              }}
                            >
                              <badge.icon className="h-3.5 w-3.5" />
                              {badge.label}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{badge.tooltip}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>

                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <Filter className="h-3.5 w-3.5" />
                    Filters
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
              <TabsContent value="publications" className="m-0">
                <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="pl-6 w-[140px]">Preview</TableHead>
                  <TableHead className="w-[320px]">Article</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead>DDS</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Lifetime</TableHead>
                  <TableHead>Avg Pos</TableHead>
                  <TableHead className="pr-6">Est. Traffic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPublications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                      No publications found matching current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPublications.map((pub) => (
                    <TableRow
                      key={pub.id}
                      className="border-border/50 hover:bg-muted/40 transition-colors cursor-pointer"
                      onClick={() => handlePublicationClick(pub.id)}
                    >
                      <TableCell className="pl-6 py-4">
                        <img
                          src={pub.image}
                          alt={pub.title}
                          className="h-16 w-28 rounded-md object-cover"
                          loading="lazy"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium line-clamp-2 hover:text-primary transition-colors">
                              {pub.title}
                            </span>
                            {pub.badges.includes("trending") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
                                      <Flame className="w-3 h-3 text-red-600" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Trending</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {pub.badges.includes("new") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100">
                                      <Sparkles className="w-3 h-3 text-yellow-600" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>New</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {pub.badges.includes("wide_geo") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                                      <TrendingUp className="w-3 h-3 text-green-600" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Wide Geo</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            {pub.badges.includes("reappeared") && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100">
                                      <Repeat className="w-3 h-3 text-blue-600" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>Reappeared</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{pub.publishedDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{pub.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {pub.format.map((f, i) => (
                            <div key={i} className="text-muted-foreground" title={f}>
                              {/* Simple icon representation */}
                              {f === 'title-only' && <div className="w-4 h-3 border border-current opacity-50 rounded-[1px]" />}
                              {f === 'title-image' && <div className="flex gap-[1px] w-4 h-3"><div className="w-2.5 border border-current opacity-50 rounded-[1px]" /><div className="w-1 bg-current opacity-30 rounded-[1px]" /></div>}
                              {f === 'image-top' && <div className="flex flex-col gap-[1px] w-4 h-3"><div className="h-1.5 bg-current opacity-30 rounded-[1px]" /><div className="h-1 border border-current opacity-50 rounded-[1px]" /></div>}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{pub.country}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img src={pub.favicon} alt="" className="w-4 h-4 rounded-full" onError={(e) => e.currentTarget.style.display = 'none'} />
                          <button
                            className="text-sm font-medium hover:text-primary"
                            onClick={(event) => handlePublisherClick(event, pub.domain)}
                          >
                            {pub.domain}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {pub.entities.map((entity) => (
                            <Badge
                              key={entity}
                              variant="outline"
                              className="text-xs"
                              onClick={(event) => handleEntityClick(event, entity)}
                            >
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{pub.dds}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground hover:text-primary"
                          onClick={(event) => handleCategoryClick(event, pub.category)}
                        >
                          {pub.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{pub.lifetime}</TableCell>
                      <TableCell className="font-medium">{pub.avgPosition}</TableCell>
                      <TableCell className="pr-6 font-medium">{pub.estTraffic}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredPublications.length)} of {filteredPublications.length} publications
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
              </TabsContent>
              <TabsContent value="publishers" className="m-0">
                <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Publisher</TableHead>
                    <TableHead className="text-right">Publications</TableHead>
                    <TableHead className="text-right">Est. Traffic</TableHead>
                    <TableHead className="text-right">DDS</TableHead>
                    <TableHead>Main category</TableHead>
                    <TableHead className="text-right">Avg Position</TableHead>
                  </TableRow>
                </TableHeader>
                  <TableBody>
                    {topPublishers.map((publisher) => (
                      <TableRow
                        key={publisher.domain}
                        className="border-border/50 cursor-pointer hover:bg-muted/40"
                        onClick={() => handlePublisherRowClick(publisher.domain)}
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={publisher.favicon}
                              alt=""
                              className="w-5 h-5 rounded-full"
                              onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium leading-tight">{publisher.name}</span>
                              <span className="text-xs text-muted-foreground">{publisher.domain}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{publisher.publications}</TableCell>
                        <TableCell className="text-right font-medium">{publisher.estTraffic}</TableCell>
                        <TableCell className="text-right font-medium">{publisher.dds}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {publisher.mainCategory}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {publisher.avgPosition.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
          </CardContent>
          </Tabs>
        </Card>

        {/* Block 4: Co-occurrence Widget */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-green-600" />
                Rising Combinations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Combination</TableHead>
                      <TableHead className="text-right">Publications</TableHead>
                      <TableHead className="text-right">Est. Traffic</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {risingSlice.map(item => {
                    const comboEntities = Array.from(
                      new Set([entityName, item.name, ...item.relatedEntities])
                    );

                    return (
                      <TableRow
                        key={item.id}
                        className="border-border/50 cursor-pointer hover:bg-muted/40"
                        onClick={() => handleCombinationClick(item.id)}
                      >
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {comboEntities.map((entity) => (
                              <Badge
                                key={`${item.id}-${entity}`}
                                variant={entity === entityName ? "default" : "outline"}
                                className={`text-xs ${
                                  entity === entityName
                                    ? "bg-primary/15 text-primary border-primary/30"
                                    : "border-dashed hover:border-primary/40"
                                }`}
                                onClick={(event) => {
                                  if (entity === entityName) {
                                    event.stopPropagation();
                                    return;
                                  }
                                  handleEntityClick(event, entity);
                                }}
                              >
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          {formatValueWithDelta(item.publications, item.pubChange)}
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          {formatValueWithDelta(item.traffic, item.trafficChange)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Page {risingPage} of {risingTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRisingPage((prev) => Math.max(1, prev - 1))}
                    disabled={risingPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRisingPage((prev) => Math.min(risingTotalPages, prev + 1))}
                    disabled={risingPage === risingTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-red-600" />
                Falling Combinations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                    <TableRow className="border-border/50">
                      <TableHead>Combination</TableHead>
                      <TableHead className="text-right">Publications</TableHead>
                      <TableHead className="text-right">Est. Traffic</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                  {fallingSlice.map(item => {
                    const comboEntities = Array.from(
                      new Set([entityName, item.name, ...item.relatedEntities])
                    );

                    return (
                      <TableRow
                        key={item.id}
                        className="border-border/50 cursor-pointer hover:bg-muted/40"
                        onClick={() => handleCombinationClick(item.id)}
                      >
                        <TableCell>
                          <div className="flex flex-wrap gap-1.5">
                            {comboEntities.map((entity) => (
                              <Badge
                                key={`${item.id}-${entity}`}
                                variant={entity === entityName ? "default" : "outline"}
                                className={`text-xs ${
                                  entity === entityName
                                    ? "bg-primary/15 text-primary border-primary/30"
                                    : "border-dashed hover:border-primary/40"
                                }`}
                                onClick={(event) => {
                                  if (entity === entityName) {
                                    event.stopPropagation();
                                    return;
                                  }
                                  handleEntityClick(event, entity);
                                }}
                              >
                                {entity}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          {formatValueWithDelta(item.publications, item.pubChange)}
                        </TableCell>
                        <TableCell className="text-right align-middle">
                          {formatValueWithDelta(item.traffic, item.trafficChange)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Page {fallingPage} of {fallingTotalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFallingPage((prev) => Math.max(1, prev - 1))}
                    disabled={fallingPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFallingPage((prev) => Math.min(fallingTotalPages, prev + 1))}
                    disabled={fallingPage === fallingTotalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  );
}
