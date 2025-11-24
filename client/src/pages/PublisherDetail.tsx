import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
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
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Download,
  Filter,
  Flame,
  Repeat,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { mockPublications } from "@/data/mock-publications";
import { publisherRecords } from "@/data/publishers";

const COUNTRY_OPTIONS = [
  { value: "worldwide", label: "Worldwide" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
  { value: "spain", label: "Spain" },
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

const QUICK_FILTERS = [
  { key: "new", label: "New", icon: Sparkles },
  { key: "trending", label: "Trending", icon: Flame },
  { key: "wide_geo", label: "Wide GEO", icon: TrendingUp },
  { key: "reappeared", label: "Reappeared", icon: Repeat },
] as const;

const COUNTRY_EMOJI: Record<string, string> = {
  worldwide: "🌍",
  usa: "🇺🇸",
  uk: "🇬🇧",
  germany: "🇩🇪",
  france: "🇫🇷",
  spain: "🇪🇸",
  canada: "🇨🇦",
};

const pageSize = 20;

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

const formatTrafficValue = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return `${Math.round(value / 1_000)}K`;
};

const getDeltaFromSeed = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const normalized = hash % 21;
  return normalized - 10;
};

export default function PublisherDetail() {
  const [, params] = useRoute("/publisher/:domain");
  const [, navigate] = useLocation();
  const publisherDomain = params?.domain ? decodeURIComponent(params.domain) : "";
  const publisher = publisherRecords.find(
    (item) => item.domain.toLowerCase() === publisherDomain.toLowerCase()
  );

  const [filterCountry, setFilterCountry] =
    useState<(typeof COUNTRY_OPTIONS)[number]["value"]>("worldwide");
  const [filterLanguage, setFilterLanguage] =
    useState<(typeof LANGUAGE_OPTIONS)[number]["value"]>("all");
  const [filterPeriod, setFilterPeriod] =
    useState<(typeof PERIOD_OPTIONS)[number]["value"]>("1m");
  const [filterBadges, setFilterBadges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState<Record<keyof typeof chartConfig, boolean>>({
    allPublications: true,
    newPublications: true,
    traffic: true,
    position: true,
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/publishers");
    }
  };

  useEffect(() => {
    if (filterPeriod !== "custom") {
      setCustomPopoverOpen(false);
    }
  }, [filterPeriod]);

  const filteredPublications = useMemo(() => {
    return mockPublications.filter((pub) => {
      if (!publisherDomain || pub.domain.toLowerCase() !== publisherDomain.toLowerCase()) {
        return false;
      }

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
  }, [publisherDomain, filterCountry, filterLanguage, filterBadges]);

  const metrics = useMemo(() => {
    if (!publisher) {
      return {
        rating: 0,
        ratingDelta: 0,
        publications: 0,
        publicationsDelta: 0,
        traffic: "0K",
        trafficDelta: 0,
        avgLifetime: "0h",
        lifetimeDelta: 0,
        avgPosition: "0.0",
        positionDelta: 0,
        dds: 0,
        ddsDelta: 0,
      };
    }

    const lifetimeValues = filteredPublications.map((pub) =>
      parseInt(pub.lifetime.replace("h", ""), 10)
    );
    const avgLifetimeHours =
      lifetimeValues.length > 0
        ? lifetimeValues.reduce((acc, value) => acc + value, 0) / lifetimeValues.length
        : publisher.avgLifetimeHours;

    const avgPosition =
      filteredPublications.length > 0
        ? filteredPublications.reduce((acc, pub) => acc + pub.avgPosition, 0) /
          filteredPublications.length
        : 2.8;

    const trafficSum = filteredPublications.reduce(
      (acc, pub) => acc + parseFloat(pub.estTraffic),
      0
    );

    return {
      rating: publisher.rating,
      ratingDelta: publisher.ratingChange,
      publications:
        filteredPublications.length > 0 ? filteredPublications.length : publisher.publications,
      publicationsDelta: publisher.publicationsChange,
      traffic:
        filteredPublications.length > 0
          ? `${trafficSum.toFixed(1)}K`
          : formatTrafficValue(publisher.estTraffic),
      trafficDelta: publisher.estTrafficChange,
      avgLifetime: `${Math.round(avgLifetimeHours)}h`,
      lifetimeDelta: publisher.avgLifetimeChange,
      avgPosition: avgPosition.toFixed(1),
      positionDelta: getDeltaFromSeed(`${publisherDomain}-position`),
      dds: publisher.dds,
      ddsDelta: publisher.ddsChange,
    };
  }, [filteredPublications, publisher, publisherDomain]);

  const multiplier = useMemo(() => {
    if (!publisher) return 1;
    return Math.max(0.8, Math.min(2, publisher.publications / 1500));
  }, [publisher]);

  const chartData = useMemo(() => generateChartData(multiplier), [multiplier]);

  const paginatedPublications = useMemo(
    () =>
      filteredPublications.slice(
        (currentPage - 1) * pageSize,
        (currentPage - 1) * pageSize + pageSize
      ),
    [filteredPublications, currentPage]
  );

  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / pageSize));

  const periodLabel =
    filterPeriod === "custom"
      ? customRange?.from && customRange?.to
        ? `${customRange.from.toLocaleDateString()} – ${customRange.to.toLocaleDateString()}`
        : "Select range"
      : PERIOD_OPTIONS.find((option) => option.value === filterPeriod)?.label ?? "Period";

  const topCountries = useMemo(() => {
    const map = new Map<
      string,
      { publications: number; estTraffic: number; change: number }
    >();

    filteredPublications.forEach((pub) => {
      const key = pub.country;
      if (!map.has(key)) {
        map.set(key, {
          publications: 0,
          estTraffic: 0,
          change: getDeltaFromSeed(`${publisherDomain}-${key}`),
        });
      }
      const entry = map.get(key)!;
      entry.publications += 1;
      entry.estTraffic += parseFloat(pub.estTraffic);
    });

    if (map.size === 0 && publisher) {
      publisher.countries.forEach((country) => {
        map.set(country, {
          publications: Math.round(publisher.publications / publisher.countries.length),
          estTraffic: publisher.estTraffic / publisher.countries.length / 1000,
          change: getDeltaFromSeed(`${publisherDomain}-${country}`),
        });
      });
    }

    return Array.from(map.entries())
      .map(([country, data]) => ({
        country,
        emoji: COUNTRY_EMOJI[country.toLowerCase()] ?? "🌐",
        publications: data.publications,
        estTraffic:
          data.estTraffic > 0 ? `${data.estTraffic.toFixed(1)}K` : formatTrafficValue(200_000),
        change: data.change,
      }))
      .sort((a, b) => b.publications - a.publications)
      .slice(0, 5);
  }, [filteredPublications, publisher, publisherDomain]);

  const topCategories = useMemo(() => {
    const map = new Map<string, number>();
    filteredPublications.forEach((pub) => {
      map.set(pub.category, (map.get(pub.category) ?? 0) + 1);
    });
    if (map.size === 0 && publisher) {
      map.set(publisher.mainCategory, Math.max(5, Math.round(publisher.publications / 10)));
    }
    return Array.from(map.entries())
      .map(([category, publications]) => ({
        category,
        publications,
      }))
      .sort((a, b) => b.publications - a.publications)
      .slice(0, 5);
  }, [filteredPublications, publisher]);

  const topEntities = useMemo(() => {
    const map = new Map<
      string,
      { publications: number; traffic: number; avgPosition: number }
    >();
    filteredPublications.forEach((pub) => {
      pub.entities.forEach((entity) => {
        if (!map.has(entity)) {
          map.set(entity, { publications: 0, traffic: 0, avgPosition: 0 });
        }
        const entry = map.get(entity)!;
        entry.publications += 1;
        entry.traffic += parseFloat(pub.estTraffic);
        entry.avgPosition += pub.avgPosition;
      });
    });
    return Array.from(map.entries())
      .map(([entity, data]) => ({
        entity,
        publications: data.publications,
        estTraffic: `${(data.traffic / 1_000).toFixed(1)}K`,
        avgPosition: data.publications
          ? (data.avgPosition / data.publications).toFixed(1)
          : "-",
      }))
      .sort((a, b) => b.publications - a.publications)
      .slice(0, 5);
  }, [filteredPublications]);

  const toggleSeries = (key: keyof typeof chartConfig) => {
    setVisibleSeries((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
                Publisher Detail
              </p>
              <h1 className="text-3xl font-bold text-foreground mt-1">
                {publisher?.name ?? publisherDomain}
              </h1>
              <p className="text-muted-foreground text-sm">
                {publisherDomain} · {publisher?.mainCategory ?? "Media property"}
              </p>
            </div>
          </div>
          {publisher && (
            <Badge variant="outline" className="text-xs">
              Rating #{publisher.rating}
            </Badge>
          )}
        </div>

        <Card className="border border-border shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4">
              <Select value={filterCountry} onValueChange={(value) => setFilterCountry(value as typeof filterCountry)}>
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

              <Select value={filterLanguage} onValueChange={(value) => setFilterLanguage(value as typeof filterLanguage)}>
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

              <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as typeof filterPeriod)}>
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
                      {periodLabel}
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              label: "Rating",
              value: metrics.rating ? `#${metrics.rating}` : "N/A",
              delta: `${metrics.ratingDelta > 0 ? "+" : ""}${metrics.ratingDelta} pt`,
            },
            {
              label: "Publications",
              value: metrics.publications.toLocaleString(),
              delta: `${metrics.publicationsDelta > 0 ? "+" : ""}${metrics.publicationsDelta}%`,
            },
            {
              label: "Est. Traffic",
              value: metrics.traffic,
              delta: `${metrics.trafficDelta > 0 ? "+" : ""}${metrics.trafficDelta}%`,
            },
            {
              label: "Avg Lifetime",
              value: metrics.avgLifetime,
              delta: `${metrics.lifetimeDelta > 0 ? "+" : ""}${metrics.lifetimeDelta}%`,
            },
            {
              label: "DDS",
              value: metrics.dds,
              delta: `${metrics.ddsDelta > 0 ? "+" : ""}${metrics.ddsDelta}%`,
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
                      metric.delta.includes("-") ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {metric.delta}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border border-border shadow-sm lg:col-span-2">
            <CardHeader className="flex flex-wrap gap-3 justify-between items-center">
              <CardTitle className="text-base">Publisher dynamics</CardTitle>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key) => (
                  <Button
                    key={key}
                    variant={visibleSeries[key] ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    style={{
                      backgroundColor: visibleSeries[key] ? chartConfig[key].color : undefined,
                      color: visibleSeries[key] ? "var(--primary-foreground)" : undefined,
                      borderColor: chartConfig[key].color,
                    }}
                    onClick={() => toggleSeries(key)}
                  >
                    {chartConfig[key].label}
                  </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ChartContainer config={chartConfig} className="aspect-auto h-full w-full">
                <ResponsiveContainer>
                  <ComposedChart data={chartData} margin={{ left: 0, right: 0, bottom: 0, top: 10 }}>
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
                            <span className="text-sm font-semibold">{country.publications}</span>
                            <span
                              className={`text-[10px] ${
                                country.change >= 0 ? "text-green-600" : "text-red-600"
                              }`}
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
              <CardTitle className="text-base">Top categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCategories.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not enough categories to show.</p>
              ) : (
                topCategories.map((item) => (
                  <div key={item.category} className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.publications} pubs
                    </Badge>
                  </div>
                ))
              )}
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
                      <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                        Not enough data
                      </TableCell>
                    </TableRow>
                  ) : (
                    topEntities.map((entity) => (
                      <TableRow key={entity.entity} className="border-border/50">
                        <TableCell className="font-medium">{entity.entity}</TableCell>
                        <TableCell className="text-right">{entity.publications}</TableCell>
                        <TableCell className="text-right">{entity.estTraffic}</TableCell>
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
                <CardTitle className="text-base">Publications by {publisher?.name ?? publisherDomain}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Filter or export stories published by this outlet.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  {QUICK_FILTERS.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={filterBadges.includes(filter.key) ? "default" : "outline"}
                      size="sm"
                      className={`h-8 text-xs gap-1.5 ${
                        filterBadges.includes(filter.key)
                          ? ""
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => {
                        setFilterBadges((prev) =>
                          prev.includes(filter.key)
                            ? prev.filter((item) => item !== filter.key)
                            : [...prev, filter.key]
                        );
                        setCurrentPage(1);
                      }}
                    >
                      <filter.icon className="w-3.5 h-3.5" />
                      {filter.label}
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
                  <TableHead>Category</TableHead>
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
                          <span className="text-xs text-muted-foreground">
                            {pub.publishedDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{pub.country}</TableCell>
                      <TableCell>{pub.category}</TableCell>
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
                      <TableCell className="text-sm text-muted-foreground">
                        {pub.lifetime}
                      </TableCell>
                      <TableCell className="font-medium">{pub.avgPosition}</TableCell>
                      <TableCell className="pr-6 font-medium">{pub.estTraffic}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1}–
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
