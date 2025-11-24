import React, { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { ArrowLeft, Sparkles, Flame, TrendingUp, Repeat, Filter, Download } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Bar,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { findCoOccurrenceById } from "@/data/co-occurrences";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockPublications } from "@/data/mock-publications";

const COUNTRY_OPTIONS = [
  { value: "worldwide", label: "Worldwide" },
  { value: "usa", label: "USA" },
  { value: "uk", label: "United Kingdom" },
  { value: "germany", label: "Germany" },
  { value: "france", label: "France" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "de", label: "German" },
];

const PERIOD_OPTIONS = [
  { value: "1m", label: "1 month" },
  { value: "1w", label: "1 week" },
  { value: "7d", label: "7 days" },
];

const countryLabelMap: Record<string, string> = {
  worldwide: "Worldwide",
  usa: "USA",
  uk: "United Kingdom",
  germany: "Germany",
  france: "France",
};

const generateHistoryData = (multiplier = 1) =>
  Array.from({ length: 14 }, (_, i) => ({
    day: `Day ${i + 1}`,
    publications: Math.round((Math.random() * 8 + 4) * multiplier),
    traffic: Math.round((Math.random() * 12000 + 4000) * multiplier),
  }));

export default function CombinationDetail() {
  const [, params] = useRoute("/combination/:id");
  const [, navigate] = useLocation();
  const [filterCountry, setFilterCountry] = useState("worldwide");
  const [filterLanguage, setFilterLanguage] = useState("en");
  const [filterPeriod, setFilterPeriod] = useState("1m");
  const [filterBadges, setFilterBadges] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [contextEntity] = useState(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("entity");
  });

  const combination = useMemo(
    () => (params?.id ? findCoOccurrenceById(params.id) : undefined),
    [params]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCountry, filterBadges, combination?.id]);

  const multiplier = useMemo(() => {
    const base =
      filterCountry === "worldwide"
        ? 1
        : filterCountry === "usa"
        ? 0.85
        : filterCountry === "uk"
        ? 0.75
        : 0.65;
    const periodMultiplier = filterPeriod === "1m" ? 1 : filterPeriod === "1w" ? 0.7 : 0.5;
    return base * periodMultiplier;
  }, [filterCountry, filterPeriod]);

  const historyData = useMemo(
    () => generateHistoryData(multiplier),
    [multiplier, combination?.id]
  );

  const combinationEntities = useMemo(() => {
    if (!combination) return [];
    return Array.from(
      new Set(
        [contextEntity, combination.name, ...combination.relatedEntities].filter(
          (entity): entity is string => Boolean(entity)
        )
      )
    );
  }, [combination, contextEntity]);

  const combinationKeys = useMemo(
    () => combinationEntities.map((entity) => entity.toLowerCase()),
    [combinationEntities]
  );

  const combinationPublications = useMemo(() => {
    if (!combination) return [];
    const relevant = mockPublications.filter((pub) =>
      pub.entities.some((entity) => combinationKeys.includes(entity.toLowerCase()))
    );
    return relevant.length > 0 ? relevant : mockPublications.slice(0, 30);
  }, [combination, combinationKeys]);

  const filteredPublications = useMemo(() => {
    let baseList =
      filterCountry === "worldwide"
        ? combinationPublications
        : combinationPublications.filter(
            (pub) => pub.country === countryLabelMap[filterCountry]
          );

    if (filterBadges.length > 0) {
      baseList = baseList.filter((pub) =>
        filterBadges.some((badge) => pub.badges.includes(badge))
      );
    }

    return baseList;
  }, [combinationPublications, filterCountry, filterBadges]);

  const paginatedPublications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPublications.slice(start, start + pageSize);
  }, [currentPage, filteredPublications, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredPublications.length / pageSize));

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  const handleEntityNavigate = (entity: string) => {
    navigate(`/entity/${encodeURIComponent(entity)}`);
  };

  const handlePublicationClick = (id: string) => {
    navigate(`/article/${encodeURIComponent(id)}`);
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
    handleEntityNavigate(entity);
  };

  if (!combination) {
    return (
      <DashboardLayout>
        <div className="p-6 space-y-4">
          <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Card>
            <CardHeader>
              <CardTitle>Combination not found</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              The requested combination could not be located. Please return to the entity page
              and pick another pair of entities.
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const summaryMetrics = [
    { label: "Publications", value: combination.publications, change: combination.pubChange },
    { label: "Est. Traffic", value: combination.traffic, change: combination.trafficChange },
  ];

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
      publisherOptions={["TechCrunch", "Reuters", "BBC", "Bloomberg"]}
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Entity combination
            </p>
            <h1 className="text-2xl font-semibold text-foreground">
              Insights for {combination.name}
            </h1>
          </div>
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-base text-muted-foreground">Entities involved</CardTitle>
              <div className="flex flex-wrap gap-2">
                {combinationEntities.map((entity) => (
                  <Badge
                    key={entity}
                    variant="secondary"
                    className="text-sm cursor-pointer hover:bg-secondary/80"
                    onClick={() => handleEntityNavigate(entity)}
                  >
                    {entity}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
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

              <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
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

              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[160px] h-9 text-sm">
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
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {summaryMetrics.map((metric) => {
                const deltaClass =
                  metric.change > 0
                    ? "text-green-600"
                    : metric.change < 0
                    ? "text-red-600"
                    : "text-muted-foreground";
                const value =
                  metric.label === "Est. Traffic"
                    ? metric.value.toLocaleString()
                    : metric.value.toLocaleString();

                return (
                  <Card key={metric.label} className="border border-border shadow-none bg-muted/30">
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {metric.label}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-semibold">{value}</span>
                        <span className={`text-sm font-medium ${deltaClass}`}>
                          ({metric.change >= 0 ? "+" : ""}
                          {metric.change}%)
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border border-border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">History of publications</CardTitle>
              </CardHeader>
              <CardContent className="h-[320px]">
                <ChartContainer
                  config={{
                    publications: { label: "Publications", color: "var(--primary)" },
                    traffic: { label: "Est. Traffic", color: "hsl(14 90% 60%)" },
                  }}
                  className="aspect-auto h-full w-full"
                >
                  <ResponsiveContainer>
                    <ComposedChart
                      data={historyData}
                      margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis
                        yAxisId="left"
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickFormatter={(value) => `${Math.round(value / 1000)}K`}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        yAxisId="left"
                        dataKey="publications"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="traffic"
                        stroke="hsl(14 90% 60%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base">Publications mentioning this combination</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Apply quick filters or click a row to see the publication context.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                  {[
                    { key: "new", label: "New", icon: Sparkles, tooltip: "Show newly created articles" },
                    { key: "trending", label: "Trending", icon: Flame, tooltip: "Show articles gaining momentum" },
                    { key: "wide_geo", label: "Wide GEO", icon: TrendingUp, tooltip: "Show articles with wide geographic coverage" },
                    { key: "reappeared", label: "Reappeared", icon: Repeat, tooltip: "Show articles that reappeared recently" },
                  ].map((badge) => (
                    <TooltipProvider key={badge.key}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={filterBadges.includes(badge.key) ? "default" : "outline"}
                            size="sm"
                            className={`h-8 text-xs flex items-center gap-1.5 ${
                              filterBadges.includes(badge.key)
                                ? ""
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => {
                              setFilterBadges((prev) =>
                                prev.includes(badge.key)
                                  ? prev.filter((b) => b !== badge.key)
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
            </div>
          </CardHeader>
          <CardContent className="p-0">
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
                  <TableHead className="pr-6">Traffic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPublications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                      No publications match the selected filters.
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
                        <Badge variant="secondary" className="font-normal">
                          {pub.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {pub.format.map((f, i) => (
                            <div key={i} className="text-muted-foreground" title={f}>
                              {f === "title-only" && (
                                <div className="w-4 h-3 border border-current opacity-50 rounded-[1px]" />
                              )}
                              {f === "title-image" && (
                                <div className="flex gap-[1px] w-4 h-3">
                                  <div className="w-2.5 border border-current opacity-50 rounded-[1px]" />
                                  <div className="w-1 bg-current opacity-30 rounded-[1px]" />
                                </div>
                              )}
                              {f === "image-top" && (
                                <div className="flex flex-col gap-[1px] w-4 h-3">
                                  <div className="h-1.5 bg-current opacity-30 rounded-[1px]" />
                                  <div className="h-1 border border-current opacity-50 rounded-[1px]" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{pub.country}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img
                            src={pub.favicon}
                            alt=""
                            className="w-4 h-4 rounded-full"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
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
                              key={`${pub.id}-${entity}`}
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
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {pub.dds}
                        </Badge>
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

            <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">
                Showing {filteredPublications.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(currentPage * pageSize, filteredPublications.length)} of {filteredPublications.length} publications
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

