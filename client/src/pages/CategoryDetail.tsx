import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon, ArrowLeft, Sparkles, Flame, TrendingUp, Repeat, Filter, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { mockPublications } from "@/data/mock-publications";

const COUNTRY_OPTIONS = [
  { value: "worldwide", label: "Worldwide" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
] as const;

const LANGUAGE_OPTIONS = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "de", label: "German" },
  { value: "fr", label: "French" },
  { value: "es", label: "Spanish" },
] as const;

const LANGUAGE_DOMAIN_MAP: Record<string, string[]> = {
  all: [],
  en: [".com", ".co.uk", ".us"],
  de: [".de"],
  fr: [".fr"],
  es: [".es"],
};

const PERIOD_OPTIONS = [
  { value: "1m", label: "1 month" },
  { value: "1w", label: "1 week" },
  { value: "24h", label: "24 hours" },
  { value: "custom", label: "Custom period" },
] as const;

const pageSize = 20;

const COUNTRY_EMOJI: Record<string, string> = {
  worldwide: "🌍",
  usa: "🇺🇸",
  uk: "🇬🇧",
  germany: "🇩🇪",
  france: "🇫🇷",
  spain: "🇪🇸",
};

const getDeltaFromSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const normalized = hash % 21; // 0..20
  return normalized - 10; // -10..10
};

const generateChartData = (multiplier = 1) =>
  Array.from({ length: 30 }, (_, i) => ({
    date: `2024-11-${String(i + 1).padStart(2, "0")}`,
    allPublications: Math.floor((Math.random() * 40 + 12) * multiplier),
    newPublications: Math.floor((Math.random() * 12) * multiplier),
    traffic: Math.floor((Math.random() * 55000 + 12000) * multiplier),
    position: parseFloat((Math.random() * 3 + 2).toFixed(2)),
  }));

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

export default function CategoryDetail() {
  const [, params] = useRoute("/category/:name");
  const [, navigate] = useLocation();
  const categoryName = params?.name ? decodeURIComponent(params.name) : "Category";

  const [filterCountry, setFilterCountry] =
    useState<(typeof COUNTRY_OPTIONS)[number]["value"]>("worldwide");
  const [filterLanguage, setFilterLanguage] =
    useState<(typeof LANGUAGE_OPTIONS)[number]["value"]>("all");
  const [filterPeriod, setFilterPeriod] =
    useState<(typeof PERIOD_OPTIONS)[number]["value"]>("1m");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [filterBadges, setFilterBadges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleSeries, setVisibleSeries] = useState({
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

  const filteredPublications = useMemo(() => {
    return mockPublications.filter((pub) => {
      if (pub.category.toLowerCase() !== categoryName.toLowerCase()) return false;
      if (filterCountry !== "worldwide" && pub.country.toLowerCase() !== filterCountry) {
        return false;
      }
      if (filterLanguage !== "all") {
        const endings = LANGUAGE_DOMAIN_MAP[filterLanguage] ?? [];
        if (!endings.some((ending) => pub.domain.endsWith(ending))) {
          return false;
        }
      }
      if (filterBadges.length && !filterBadges.some((badge) => pub.badges.includes(badge))) {
        return false;
      }
      return true;
    });
  }, [categoryName, filterCountry, filterLanguage, filterBadges]);

  const metrics = useMemo(() => {
    if (!filteredPublications.length) {
      return {
        publications: 0,
        traffic: "0K",
        avgLifetime: "0h",
        avgPosition: "0.0",
        deltas: {
          publications: 0,
          traffic: 0,
          avgLifetime: 0,
          avgPosition: 0,
        },
      };
    }

    const publications = filteredPublications.length;
    const trafficSum = filteredPublications.reduce((acc, pub) => {
      const val = parseFloat(pub.estTraffic);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const avgLifetime =
      filteredPublications.reduce((acc, pub) => acc + parseFloat(pub.lifetime), 0) /
      filteredPublications.length;
    const avgPosition =
      filteredPublications.reduce((acc, pub) => acc + pub.avgPosition, 0) /
      filteredPublications.length;

    return {
      publications,
      traffic: `${trafficSum.toFixed(1)}K`,
      avgLifetime: `${Math.round(avgLifetime)}h`,
      avgPosition: avgPosition.toFixed(1),
      deltas: {
        publications: getDeltaFromSeed(`${categoryName}-pubs`),
        traffic: getDeltaFromSeed(`${categoryName}-traffic`),
        avgLifetime: getDeltaFromSeed(`${categoryName}-lifetime`),
        avgPosition: getDeltaFromSeed(`${categoryName}-position`),
      },
    };
  }, [filteredPublications, categoryName]);

  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPublications.slice(start, start + pageSize);
  }, [filteredPublications, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / pageSize));

  const chartMultiplier =
    filterCountry === "worldwide" ? 1 : filterCountry === "usa" ? 0.8 : 0.6;

  const chartData = useMemo(
    () => generateChartData(chartMultiplier),
    [chartMultiplier]
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/categories");
    }
  };

  const toggleSeries = (series: keyof typeof visibleSeries) => {
    setVisibleSeries((prev) => ({ ...prev, [series]: !prev[series] }));
  };

  const topPublishers = useMemo(() => {
    const grouped = filteredPublications.reduce<Record<
      string,
      { count: number; traffic: number; dds: number; category: string; avgPos: number }
    >>((acc, pub) => {
      if (!acc[pub.domain]) {
        acc[pub.domain] = {
          count: 0,
          traffic: 0,
          dds: 0,
          category: categoryName,
          avgPos: 0,
        };
      }
      acc[pub.domain].count += 1;
      acc[pub.domain].traffic += parseFloat(pub.estTraffic) || 0;
      acc[pub.domain].dds += pub.dds;
      acc[pub.domain].avgPos += pub.avgPosition;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([domain, data]) => ({
        domain,
        publications: data.count,
        traffic: `${(data.traffic / 1_000).toFixed(1)}K`,
        dds: Math.round(data.dds / data.count),
        avgPosition: (data.avgPos / data.count).toFixed(1),
      }))
      .sort((a, b) => b.publications - a.publications)
      .slice(0, 5);
  }, [filteredPublications, categoryName]);

  const topEntities = useMemo(() => {
    const map = new Map<
      string,
      { count: number; traffic: number; avgPos: number }
    >();
    filteredPublications.forEach((pub) => {
      pub.entities.forEach((entity) => {
        if (!map.has(entity)) {
          map.set(entity, { count: 0, traffic: 0, avgPos: 0 });
        }
        const record = map.get(entity)!;
        record.count += 1;
        record.traffic += parseFloat(pub.estTraffic) || 0;
        record.avgPos += pub.avgPosition;
      });
    });
    return Array.from(map.entries())
      .map(([entity, data]) => ({
        entity,
        publications: data.count,
        traffic: `${(data.traffic / 1_000).toFixed(1)}K`,
        avgPosition: (data.avgPos / data.count).toFixed(1),
      }))
      .sort((a, b) => b.publications - a.publications)
      .slice(0, 5);
  }, [filteredPublications]);

  const topCountries = useMemo(() => {
    if (!filteredPublications.length) return [];
    const grouped = filteredPublications.reduce<Record<
      string,
      { publications: number; traffic: number }
    >>((acc, pub) => {
      if (!acc[pub.country]) {
        acc[pub.country] = { publications: 0, traffic: 0 };
      }
      acc[pub.country].publications += 1;
      acc[pub.country].traffic += parseFloat(pub.estTraffic) || 0;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([country, data]) => ({
        country,
        emoji: COUNTRY_EMOJI[country.toLowerCase()] ?? "🌐",
        publications: data.publications,
        estTraffic: `${(data.traffic / 1_000).toFixed(1)}K`,
        change: getDeltaFromSeed(`${categoryName}-${country}`),
      }))
      .sort((a, b) => b.publications - a.publications)
      .slice(0, 5);
  }, [filteredPublications, categoryName]);

  const handleCountryChange = (value: string) =>
    setFilterCountry(value as (typeof COUNTRY_OPTIONS)[number]["value"]);
  const handleLanguageChange = (value: string) =>
    setFilterLanguage(value as (typeof LANGUAGE_OPTIONS)[number]["value"]);
  const handlePeriodChange = (value: string) =>
    setFilterPeriod(value as (typeof PERIOD_OPTIONS)[number]["value"]);

  return (
    <DashboardLayout
      showStickyFilters={false}
      filterCountry={filterCountry}
      setFilterCountry={handleCountryChange}
      filterLanguage={filterLanguage}
      setFilterLanguage={handleLanguageChange}
      filterCategory="all"
      setFilterCategory={() => {}}
      filterFormat="all"
      setFilterFormat={() => {}}
      period={filterPeriod}
      setPeriod={handlePeriodChange}
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
              Category Detail
            </p>
            <h1 className="text-3xl font-bold text-foreground mt-1">{categoryName}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Overview of publications, geographies and publishers linked to this topic.
            </p>
          </div>
        </div>

        <Card className="border border-border shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4">
              <Select value={filterCountry} onValueChange={handleCountryChange}>
                <SelectTrigger className="w-[160px]">
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

              <Select value={filterLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[160px]">
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

              <Select value={filterPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-[160px]">
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

              {filterPeriod === "custom" && (
                <Popover open={customPopoverOpen} onOpenChange={setCustomPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customRange?.from && customRange?.to
                        ? `${customRange.from.toLocaleDateString()} – ${customRange.to.toLocaleDateString()}`
                        : "Select dates"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
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
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Publications",
              value: metrics.publications.toLocaleString(),
              delta: metrics.deltas.publications,
              helper: "vs previous period",
            },
            {
              label: "Est. Traffic",
              value: metrics.traffic,
              delta: metrics.deltas.traffic,
              helper: "Estimated visits",
            },
            {
              label: "Avg Lifetime",
              value: metrics.avgLifetime,
              delta: metrics.deltas.avgLifetime,
              helper: "Time in Discover",
            },
            {
              label: "Avg Position",
              value: metrics.avgPosition,
              delta: metrics.deltas.avgPosition,
              helper: "Average rank",
            },
          ].map((metric) => (
            <Card key={metric.label} className="border border-border shadow-sm">
              <CardContent className="py-4 space-y-1">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-semibold">{metric.value}</p>
                  <span
                    className={`text-xs ${
                      metric.delta >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.delta > 0 ? "+" : ""}
                    {metric.delta}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{metric.helper}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border border-border shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-wrap gap-3 justify-between items-center">
              <CardTitle className="text-base">Category dynamics</CardTitle>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map(
                  (key) => (
                    <Button
                      key={key}
                      variant={visibleSeries[key] ? "default" : "outline"}
                      size="sm"
                      className="text-xs"
                      style={{
                        backgroundColor: visibleSeries[key]
                          ? chartConfig[key].color
                          : undefined,
                        color: visibleSeries[key] ? "var(--primary-foreground)" : undefined,
                        borderColor: chartConfig[key].color,
                      }}
                      onClick={() => toggleSeries(key)}
                    >
                      {chartConfig[key].label}
                    </Button>
                  )
                )}
              </div>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <ResponsiveContainer>
                  <ComposedChart
                    data={chartData}
                    margin={{ left: 0, right: 0, bottom: 0, top: 10 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {visibleSeries.allPublications && (
                      <Bar
                        yAxisId="left"
                        dataKey="allPublications"
                        fill="var(--color-allPublications)"
                        stackId="a"
                        radius={[0, 0, 4, 4]}
                      />
                    )}
                    {visibleSeries.newPublications && (
                      <Bar
                        yAxisId="left"
                        dataKey="newPublications"
                        fill="var(--color-newPublications)"
                        stackId="a"
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                    {visibleSeries.traffic && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="traffic"
                        stroke="var(--color-traffic)"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                    {visibleSeries.position && (
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="position"
                        stroke="var(--color-position)"
                        strokeWidth={2}
                        dot={false}
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Top countries</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Publications</TableHead>
                    <TableHead className="text-right">Est. Traffic</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCountries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">
                        Not enough data
                      </TableCell>
                    </TableRow>
                  ) : (
                    topCountries.map((country) => (
                      <TableRow key={country.country} className="border-border/50">
                        <TableCell className="flex items-center gap-2">
                          <span>{country.emoji}</span>
                          {country.country}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold">
                              {country.publications}
                            </span>
                            <span
                              className={`text-[10px] ${country.change >= 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {country.change > 0 ? "+" : ""}
                              {country.change}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {country.estTraffic}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top publishers</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Publisher</TableHead>
                    <TableHead className="text-right">Publications</TableHead>
                    <TableHead className="text-right">Est. Traffic</TableHead>
                    <TableHead className="text-right">DDS</TableHead>
                    <TableHead>Main category</TableHead>
                    <TableHead className="text-right">Avg Pos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPublishers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-20 text-center text-sm text-muted-foreground"
                      >
                        No data for selected filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    topPublishers.map((publisher) => (
                      <TableRow
                        key={publisher.domain}
                        className="border-border/50 cursor-pointer hover:bg-muted/40"
                        onClick={() =>
                          navigate(`/publisher/${encodeURIComponent(publisher.domain)}`)
                        }
                      >
                        <TableCell className="py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={`https://www.google.com/s2/favicons?domain=${publisher.domain}`}
                              alt=""
                              className="w-5 h-5 rounded-full"
                              onError={(event) => {
                                (event.currentTarget as HTMLImageElement).style.display = "none";
                              }}
                            />
                            <div className="flex flex-col">
                              <span className="font-medium leading-tight">{publisher.domain}</span>
                              <span className="text-xs text-muted-foreground">
                                {publisher.domain}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {publisher.publications}
                        </TableCell>
                        <TableCell className="text-right font-medium">{publisher.traffic}</TableCell>
                        <TableCell className="text-right font-medium">{publisher.dds}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {categoryName}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {publisher.avgPosition}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top entities</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50">
                    <TableHead>Entity</TableHead>
                    <TableHead className="text-right">Publications</TableHead>
                    <TableHead className="text-right">Est. Traffic</TableHead>
                    <TableHead className="text-right">Avg Pos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topEntities.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="h-20 text-center text-sm text-muted-foreground"
                      >
                        Not enough data
                      </TableCell>
                    </TableRow>
                  ) : (
                    topEntities.map((entity) => (
                      <TableRow
                        key={entity.entity}
                        className="border-border/50 cursor-pointer hover:bg-muted/40"
                        onClick={() => navigate(`/entity/${encodeURIComponent(entity.entity)}`)}
                      >
                        <TableCell className="font-medium">{entity.entity}</TableCell>
                        <TableCell className="text-right">{entity.publications}</TableCell>
                        <TableCell className="text-right">{entity.traffic}</TableCell>
                        <TableCell className="text-right">{entity.avgPosition}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Publications</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Filter or export articles that belong to this category.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  {[
                    { key: "new", label: "New", icon: Sparkles },
                    { key: "trending", label: "Trending", icon: Flame },
                    { key: "wide_geo", label: "Wide GEO", icon: TrendingUp },
                    { key: "reappeared", label: "Reappeared", icon: Repeat },
                  ].map((badge) => (
                    <Button
                      key={badge.key}
                      variant={filterBadges.includes(badge.key) ? "default" : "outline"}
                      size="sm"
                      className={`h-8 text-xs gap-1.5 ${
                        filterBadges.includes(badge.key)
                          ? ""
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => {
                        setFilterBadges((prev) =>
                          prev.includes(badge.key)
                            ? prev.filter((item) => item !== badge.key)
                            : [...prev, badge.key]
                        );
                        setCurrentPage(1);
                      }}
                    >
                      <badge.icon className="w-3.5 h-3.5" />
                      {badge.label}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead className="pl-6 w-[160px]">Preview</TableHead>
                  <TableHead className="w-[320px]">Article</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Entities</TableHead>
                  <TableHead>DDS</TableHead>
                  <TableHead>Lifetime</TableHead>
                  <TableHead>Avg Pos</TableHead>
                  <TableHead className="pr-6">Est. Traffic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPublications.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="h-24 text-center text-muted-foreground text-sm"
                    >
                      No publications match current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPublications.map((pub) => (
                    <TableRow
                      key={pub.id}
                      className="border-border/50 hover:bg-muted/40 cursor-pointer"
                      onClick={() => navigate(`/article/${encodeURIComponent(pub.id)}`)}
                    >
                      <TableCell className="pl-6 py-4">
                        <img
                          src={pub.image}
                          alt={pub.title}
                          className="h-16 w-28 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium line-clamp-2">{pub.title}</span>
                          <span className="text-xs text-muted-foreground">{pub.publishedDate}</span>
                        </div>
                      </TableCell>
                      <TableCell>{pub.country}</TableCell>
                      <TableCell>
                        <button
                          className="text-sm font-medium hover:text-primary"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/publisher/${encodeURIComponent(pub.domain)}`);
                          }}
                        >
                          {pub.domain}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5">
                          {pub.entities.map((entity) => (
                            <Badge
                              key={entity}
                              variant="outline"
                              className="text-xs"
                              onClick={(event) => {
                                event.stopPropagation();
                                navigate(`/entity/${encodeURIComponent(entity)}`);
                              }}
                            >
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {pub.dds}
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

            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * pageSize) + 1}–
                {Math.min(currentPage * pageSize, filteredPublications.length)} of{" "}
                {filteredPublications.length} publications
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
