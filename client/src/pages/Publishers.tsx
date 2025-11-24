import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, Search } from "lucide-react";
import { publisherRecords, type PublisherRecord } from "@/data/publishers";

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

const CATEGORY_OPTIONS = [
  { value: "all", label: "All categories" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "health", label: "Health" },
  { value: "sports", label: "Sports" },
  { value: "entertainment", label: "Entertainment" },
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

type PublisherRecord = {
  id: string;
  name: string;
  domain: string;
  favicon: string;
  rating: number;
  ratingChange: number;
  publications: number;
  publicationsChange: number;
  avgLifetimeHours: number;
  avgLifetimeChange: number;
  estTraffic: number;
  estTrafficChange: number;
  dds: number;
  ddsChange: number;
  mainCategory: string;
  category: string;
  formats: string[];
  countries: string[];
  languages: string[];
  periods: string[];
  tags: QuickFilter[];
  topEntities: string[];
  sparkline: number[];
};

type PublisherWithRank = PublisherRecord & { rank: number };

const formatChange = (value: number, suffix = "%") =>
  `${value > 0 ? "+" : value < 0 ? "" : ""}${value}${suffix}`;

const formatLifetime = (hours: number) => `${Math.round(hours)}h`;

const formatTraffic = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  return `${Math.round(value / 1_000)}K`;
};

const getTrendClass = (value: number) => {
  if (value > 0) return "text-green-600";
  if (value < 0) return "text-red-600";
  return "text-muted-foreground";
};

const rawPublishers: PublisherRecord[] = publisherRecords;

const PAGE_SIZE = 20;

export default function Publishers() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [country, setCountry] = useState<(typeof COUNTRY_OPTIONS)[number]["value"]>("all");
  const [language, setLanguage] =
    useState<(typeof LANGUAGE_OPTIONS)[number]["value"]>("all");
  const [category, setCategory] =
    useState<(typeof CATEGORY_OPTIONS)[number]["value"]>("all");
  const [format, setFormat] = useState<(typeof FORMAT_OPTIONS)[number]["value"]>("all");
  const [period, setPeriod] = useState<(typeof PERIOD_OPTIONS)[number]["value"]>("live");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [page, setPage] = useState(1);
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

  const periodLabel =
    period === "custom"
      ? customRange?.from && customRange?.to
        ? `${customRange.from.toLocaleDateString()} – ${customRange.to.toLocaleDateString()}`
        : "Select range"
      : PERIOD_OPTIONS.find((option) => option.value === period)?.label ?? "Period";

  const handleNavigate = (publisher: PublisherRecord) => {
    navigate(`/publisher/${encodeURIComponent(publisher.domain)}`);
  };

  const filteredPublishers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return rawPublishers.filter((publisher) => {
      if (country !== "all" && !publisher.countries.includes(country)) return false;
      if (language !== "all" && !publisher.languages.includes(language)) return false;
      if (category !== "all" && publisher.category !== category) return false;
      if (format !== "all" && !publisher.formats.includes(format)) return false;
      if (period !== "custom" && period !== "live" && !publisher.periods.includes(period))
        return false;

      if (query) {
        const haystack = `${publisher.name} ${publisher.domain} ${publisher.mainCategory} ${publisher.topEntities.join(" ")}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [searchQuery, country, language, category, format, period]);

  const sortedPublishers = useMemo(() => {
    const copy = [...filteredPublishers];
    copy.sort((a, b) => b.rating - a.rating);
    return copy;
  }, [filteredPublishers]);

  const rankedPublishers = useMemo<PublisherWithRank[]>(
    () =>
      sortedPublishers.map((publisher, index) => ({
        ...publisher,
        rank: index + 1,
      })),
    [sortedPublishers]
  );

  const totalPages = Math.max(1, Math.ceil(rankedPublishers.length / PAGE_SIZE));
  const paginatedPublishers = useMemo(
    () =>
      rankedPublishers.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE),
    [rankedPublishers, page]
  );

  return (
    <DashboardLayout
      showStickyFilters={showStickyFilters}
      filterCountry={country}
      setFilterCountry={(value) => {
        setCountry(value);
        setPage(1);
      }}
      filterLanguage={language}
      setFilterLanguage={(value) => {
        setLanguage(value);
        setPage(1);
      }}
      filterCategory={category}
      setFilterCategory={(value) => {
        setCategory(value);
        setPage(1);
      }}
      filterFormat={format}
      setFilterFormat={(value) => {
        setFormat(value);
        setPage(1);
      }}
      period={period}
      setPeriod={(value) => {
        setPeriod(value);
        setPage(1);
      }}
    >
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
              Discover Explorer
            </p>
            <h1 className="text-3xl font-bold text-foreground mt-2">Publishers</h1>
            <p className="text-muted-foreground mt-1">
              Benchmark media performance in Google Discover across GEOs, formats and topics.
            </p>
          </div>
        </div>

        <div
          ref={filterSectionRef}
          className="border border-border shadow-sm rounded-lg bg-card"
        >
          <div className="py-4 px-6 space-y-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search publishers or domains"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select
                value={country}
                onValueChange={(value) => {
                  setCountry(value as typeof country);
                  setPage(1);
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
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
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
                value={category}
                onValueChange={(value) => {
                  setCategory(value as typeof category);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
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
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
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
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Period" />
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
                      selected={customRange}
                      numberOfMonths={2}
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
                <CardTitle>Publisher leaderboard</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedPublishers.length} of {rankedPublishers.length} publishers
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {periodLabel}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {rankedPublishers.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-sm">
                Нет паблишеров, удовлетворяющих выбранным фильтрам
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[240px]">Publisher</TableHead>
                    <TableHead className="w-[120px]">Rating</TableHead>
                    <TableHead className="w-[160px]">Publications</TableHead>
                    <TableHead className="w-[150px]">Avg Lifetime</TableHead>
                    <TableHead className="w-[150px]">Est. Traffic</TableHead>
                    <TableHead className="w-[120px]">DDS</TableHead>
                    <TableHead className="w-[180px]">Main category</TableHead>
                    <TableHead className="w-[220px]">Top entities</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPublishers.map((publisher) => (
                    <TableRow
                      key={publisher.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleNavigate(publisher)}
                    >
                      <TableCell className="align-top">
                        <div className="flex gap-3">
                          <img
                            src={publisher.favicon}
                            alt=""
                            className="w-8 h-8 rounded-full border border-border"
                            onError={(event) => {
                              (event.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                          <div className="flex flex-col gap-1">
                            <span className="font-semibold">{publisher.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {publisher.domain}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold">{publisher.rank}</span>
                          <span className={`text-xs ${getTrendClass(publisher.ratingChange)}`}>
                            {publisher.ratingChange > 0 ? "+" : ""}
                            {publisher.ratingChange} pt
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold">
                            {publisher.publications.toLocaleString()}
                          </span>
                          <span
                            className={`text-xs ${getTrendClass(publisher.publicationsChange)}`}
                          >
                            {formatChange(publisher.publicationsChange)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold">
                            {formatLifetime(publisher.avgLifetimeHours)}
                          </span>
                          <span
                            className={`text-xs ${getTrendClass(publisher.avgLifetimeChange)}`}
                          >
                            {formatChange(publisher.avgLifetimeChange)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold">
                            {formatTraffic(publisher.estTraffic)}
                          </span>
                          <span
                            className={`text-xs ${getTrendClass(publisher.estTrafficChange)}`}
                          >
                            {formatChange(publisher.estTrafficChange)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold">{publisher.dds}</span>
                          <span className={`text-xs ${getTrendClass(publisher.ddsChange)}`}>
                            {formatChange(publisher.ddsChange)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-top font-medium">
                        {publisher.mainCategory}
                      </TableCell>
                      <TableCell className="align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {publisher.topEntities.map((entity) => (
                            <Badge key={entity} variant="outline" className="text-xs">
                              {entity}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {rankedPublishers.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-2 py-4 border-t border-border/50 mt-2">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages}
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
