import { ArrowLeft, Flame, Sparkles, Repeat, Globe, Plus } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useState, type ElementType, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

export default function ArticleDetail() {
  const [, navigate] = useLocation();

  const article = {
    title: "AI Revolutionizes Content Discovery Across the Globe",
    badges: ["trending", "new", "wide_geo"],
    summary:
      "Across multiple regions, publishers are experimenting with AI-generated summaries and adaptive layouts to increase engagement in Discover. This article unpacks what works, what doesn't, and which tactics will remain compliant with Google's guidance.",
    url: "https://www.techradar.com/ai-revolutionizes-content-discovery",
    displayFormats: ["title-only", "title-image", "image-top"],
    topics: ["Artificial Intelligence", "Publishing", "Discover Optimization", "Content Strategy"],
    category: "Technology",
    publicationDate: "2025-11-13T09:30:00Z",
    lastModified: "2025-11-13T23:45:00Z",
    firstSeen: "2025-11-13T10:05:00Z",
    lastSeen: "2025-11-14T04:25:00Z",
    primaryRegion: "United States",
    language: "English",
    domain: {
      name: "techradar.com",
      favicon: "https://techradar.com/favicon.ico",
      dds: 88,
    },
    metrics: {
      words: 1230,
      characters: 7520,
      images: 14,
      extraEntities: ["Google", "OpenAI", "YouTube", "EU Commission"],
    },
  };

  const regionDistribution = [
    { region: "US", traffic: 45, visibility: 38 },
    { region: "UK", traffic: 20, visibility: 28 },
    { region: "IN", traffic: 15, visibility: 12 },
    { region: "CA", traffic: 12, visibility: 10 },
    { region: "DE", traffic: 8, visibility: 9 },
  ];
  const regionColors = ["#38bdf8", "#f97316", "#10b981", "#6366f1", "#facc15"];
  const regionKeys = regionDistribution.map(region => region.region);
  const impressionHistory = [
    {
      id: 1,
      timestamp: "2025-11-14T04:25:00Z",
      position: 3,
      format: "Image on top",
      snapshotId: "2025-11-14-0425",
      previewImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop",
    },
    {
      id: 2,
      timestamp: "2025-11-14T01:10:00Z",
      position: 4,
      format: "Title + Image",
      snapshotId: "2025-11-14-0110",
      previewImage: "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=400&auto=format&fit=crop",
    },
    {
      id: 3,
      timestamp: "2025-11-13T21:45:00Z",
      position: 6,
      format: "Title only",
      snapshotId: "2025-11-13-2145",
      previewImage: "https://images.unsplash.com/photo-1485217988980-11786ced9454?w=400&auto=format&fit=crop",
    },
    {
      id: 4,
      timestamp: "2025-11-13T16:05:00Z",
      position: 2,
      format: "Image on top",
      snapshotId: "2025-11-13-1605",
      previewImage: "https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=400&auto=format&fit=crop",
    },
  ];
  const relatedArticles = [
    {
      id: "article-124",
      title: "Publishers test AI blurbs to win Discover clicks",
      domain: "wired.com",
      similarity: 92,
      format: "Title + Image",
      publishedAt: "2025-11-14T03:50:00Z",
      excerpt:
        "Editors experiment with AI-generated blurbs to increase tap-through rate and personalize Discover tiles.",
      entities: ["AI blurbs", "CTR"],
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=320&auto=format&fit=crop",
    },
    {
      id: "article-131",
      title: "Google clarifies Discover compliance on synthetic imagery",
      domain: "searchengineland.com",
      similarity: 87,
      format: "Image on top",
      publishedAt: "2025-11-13T23:40:00Z",
      excerpt:
        "Policy update explains how synthetic imagery should be labeled in Discover to avoid demotions.",
      entities: ["Synthetic imagery", "Policy"],
      thumbnail: "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=320&auto=format&fit=crop",
    },
    {
      id: "article-142",
      title: "Regional Discover panels reward multi-language newsrooms",
      domain: "thenextweb.com",
      similarity: 81,
      format: "Title only",
      publishedAt: "2025-11-13T20:10:00Z",
      excerpt: "Localized language variants help publishers secure multiple placements in bilingual Discover panels.",
      entities: ["Regional panel", "Localization"],
      thumbnail: "https://images.unsplash.com/photo-1485217988980-11786ced9454?w=320&auto=format&fit=crop",
    },
  ];
  const insightHighlights = [
    {
      title: "Rising momentum",
      detail: "Traffic slope indicates the article will likely stay surfaced for 12–18h.",
      metricLabel: "Projected runtime",
      metricValue: "12-18h",
      chartColor: "#0ea5e9",
      chartData: [
        { t: "04:00", v: 22 },
        { t: "06:00", v: 28 },
        { t: "08:00", v: 31 },
        { t: "10:00", v: 38 },
        { t: "12:00", v: 45 },
      ],
    },
    {
      title: "Geo opportunity",
      detail: "Visibility gaps suggest IN + DE can sustain a follow-up localized piece.",
      metricLabel: "Target regions",
      metricValue: "IN · DE",
      chartColor: "#f97316",
      chartData: [
        { t: "Mon", v: 8 },
        { t: "Tue", v: 10 },
        { t: "Wed", v: 12 },
        { t: "Thu", v: 17 },
        { t: "Fri", v: 20 },
      ],
    },
    {
      title: "Seasonal cadence",
      detail: "Topic reappears roughly every 6 days; prep evergreen refresh ahead.",
      metricLabel: "Cycle length",
      metricValue: "~6d",
      chartColor: "#6366f1",
      chartData: [
        { t: "Week 1", v: 2 },
        { t: "Week 2", v: 5 },
        { t: "Week 3", v: 3 },
        { t: "Week 4", v: 6 },
        { t: "Week 5", v: 4 },
      ],
    },
  ];

  const historyByRegion: Record<
    string,
    Array<{ date: string; traffic: number; visibility: number; avgPos: number }>
  > = {
    All: [
      { date: "Nov 10", traffic: 32, visibility: 24, avgPos: 5.2 },
      { date: "Nov 11", traffic: 46, visibility: 28, avgPos: 4.7 },
      { date: "Nov 12", traffic: 64, visibility: 33, avgPos: 4.1 },
      { date: "Nov 13", traffic: 82, visibility: 42, avgPos: 3.6 },
      { date: "Nov 14", traffic: 96, visibility: 48, avgPos: 3.2 },
    ],
    US: [
      { date: "Nov 10", traffic: 18, visibility: 14, avgPos: 4.8 },
      { date: "Nov 11", traffic: 24, visibility: 15, avgPos: 4.2 },
      { date: "Nov 12", traffic: 32, visibility: 18, avgPos: 3.9 },
      { date: "Nov 13", traffic: 40, visibility: 22, avgPos: 3.5 },
      { date: "Nov 14", traffic: 46, visibility: 24, avgPos: 3.1 },
    ],
    UK: [
      { date: "Nov 10", traffic: 6, visibility: 7, avgPos: 5.4 },
      { date: "Nov 11", traffic: 9, visibility: 8, avgPos: 5.0 },
      { date: "Nov 12", traffic: 12, visibility: 9, avgPos: 4.4 },
      { date: "Nov 13", traffic: 15, visibility: 11, avgPos: 4.0 },
      { date: "Nov 14", traffic: 18, visibility: 12, avgPos: 3.6 },
    ],
    IN: [
      { date: "Nov 10", traffic: 3, visibility: 1.5, avgPos: 5.9 },
      { date: "Nov 11", traffic: 5, visibility: 2, avgPos: 5.1 },
      { date: "Nov 12", traffic: 7, visibility: 3, avgPos: 4.8 },
      { date: "Nov 13", traffic: 10, visibility: 3.7, avgPos: 4.3 },
      { date: "Nov 14", traffic: 13, visibility: 4.2, avgPos: 4.0 },
    ],
    CA: [
      { date: "Nov 10", traffic: 3, visibility: 1.2, avgPos: 5.7 },
      { date: "Nov 11", traffic: 4, visibility: 1.6, avgPos: 5.0 },
      { date: "Nov 12", traffic: 6, visibility: 2.3, avgPos: 4.6 },
      { date: "Nov 13", traffic: 7, visibility: 2.8, avgPos: 4.1 },
      { date: "Nov 14", traffic: 8, visibility: 3.1, avgPos: 3.8 },
    ],
    DE: [
      { date: "Nov 10", traffic: 2, visibility: 1.3, avgPos: 6.1 },
      { date: "Nov 11", traffic: 4, visibility: 1.6, avgPos: 5.7 },
      { date: "Nov 12", traffic: 7, visibility: 2.2, avgPos: 5.0 },
      { date: "Nov 13", traffic: 10, visibility: 2.6, avgPos: 4.4 },
      { date: "Nov 14", traffic: 11, visibility: 3.0, avgPos: 4.0 },
    ],
  };

  const formatLabels: Record<string, string> = {
    "title-only": "Title only",
    "title-image": "Title + Image",
    "image-top": "Image on top",
  };

  const badgeConfig: Record<
    string,
    { icon: ElementType; color: string; text: string }
  > = {
    trending: { icon: Flame, color: "bg-red-100 text-red-600", text: "Trending" },
    new: { icon: Sparkles, color: "bg-yellow-100 text-yellow-600", text: "New" },
    reappeared: { icon: Repeat, color: "bg-blue-100 text-blue-600", text: "Reappeared" },
    wide_geo: { icon: Globe, color: "bg-green-100 text-green-600", text: "Wide GEO" },
  };

  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(article.displayFormats[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [regionMetric, setRegionMetric] = useState<"traffic" | "visibility">("traffic");
  const [trafficMetric, setTrafficMetric] = useState<"traffic" | "visibility">("traffic");
  const [historyFilter, setHistoryFilter] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [historySort, setHistorySort] = useState<{ field: "timestamp" | "position" | "format"; direction: "asc" | "desc" }>(
    { field: "timestamp", direction: "desc" }
  );
  const [historyPage, setHistoryPage] = useState(1);
  const [relatedPage, setRelatedPage] = useState(1);
  const pageSize = 4;

  const derivedWordCount =
    article.metrics?.words ??
    article.summary
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const derivedCharacterCount = article.metrics?.characters ?? article.summary.length;

  const publishedDate = new Date(article.publicationDate);
  const lastModifiedDate = new Date(article.lastModified);
  const firstSeenDate = new Date(article.firstSeen);
  const lastSeenDate = new Date(article.lastSeen);
  const lifespanMs = Math.max(lastSeenDate.getTime() - firstSeenDate.getTime(), 0);
  const lifespanHours = lifespanMs / (1000 * 60 * 60);
  const lifespanMetric =
    lifespanHours >= 48 ? `${(lifespanHours / 24).toFixed(1)}d` : `${Math.max(1, Math.round(lifespanHours))}h`;
  const primaryTopic = article.topics[0];
  const formatDateTime = (date: Date) =>
    date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  const lifespanRange = `${formatDateTime(firstSeenDate)} → ${formatDateTime(lastSeenDate)}`;
  const pieData = regionDistribution.map(region => ({
    region: region.region,
    value: region[regionMetric],
  }));
  const regionHistoryKey = historyByRegion[selectedRegion] ? selectedRegion : "All";
  const filteredHistory = historyByRegion[regionHistoryKey] ?? historyByRegion.All;
  const regionMetricLabel = regionMetric === "traffic" ? "Traffic" : "Visibility";
  const trafficMetricLabel = trafficMetric === "traffic" ? "Traffic" : "Visibility";
  const selectedRegionLabel = selectedRegion === "All" ? "All regions" : selectedRegion;
  const stackedHistory = historyByRegion.All.map((point, index) => {
    const entry: Record<string, number | string> = { date: point.date };
    regionKeys.forEach(region => {
      entry[region] = historyByRegion[region]?.[index]?.[trafficMetric] ?? 0;
    });
    return entry;
  });
  const sortedBaseHistory = [...impressionHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const historyWithDelta = sortedBaseHistory.map((record, index) => {
    const prev = sortedBaseHistory[index + 1];
    const delta = prev ? record.position - prev.position : 0;
    return { ...record, delta };
  });
  const filteredHistoryRecords = historyWithDelta.filter(record => {
    const ts = new Date(record.timestamp).getTime();
    if (historyFilter.from && ts < new Date(historyFilter.from).getTime()) return false;
    if (historyFilter.to && ts > new Date(historyFilter.to).getTime()) return false;
    return true;
  });
  const sortedHistoryRecords = [...filteredHistoryRecords].sort((a, b) => {
    switch (historySort.field) {
      case "timestamp":
        return historySort.direction === "asc"
          ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      case "position":
        return historySort.direction === "asc" ? a.position - b.position : b.position - a.position;
      case "format":
        return historySort.direction === "asc"
          ? a.format.localeCompare(b.format)
          : b.format.localeCompare(a.format);
      default:
        return 0;
    }
  });
  const relatedArticlesSorted = [...relatedArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const historyPageCount = Math.max(1, Math.ceil(sortedHistoryRecords.length / pageSize));
  const relatedPageCount = Math.max(1, Math.ceil(relatedArticlesSorted.length / pageSize));
  const pagedHistoryRecords = sortedHistoryRecords.slice((historyPage - 1) * pageSize, historyPage * pageSize);
  const pagedRelatedArticles = relatedArticlesSorted.slice((relatedPage - 1) * pageSize, relatedPage * pageSize);

  const LabelTooltip = ({
    label,
    description,
    className = "",
  }: {
    label: string;
    description: string;
    className?: string;
  }) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-help ${className}`}>{label}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="start">
        {description}
      </TooltipContent>
    </Tooltip>
  );
  const formatTimestamp = (value: string) =>
    new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  const handleSnapshotClick = (snapshotId: string) => {
    navigate(`/feed/${encodeURIComponent(snapshotId)}`);
  };
  const handleTrack = (type: "topic" | "category" | "publisher", value: string) => {
    const typeLabel =
      type === "topic" ? "Entity" : type === "category" ? "Category" : "Publisher";
    toast.success(`${typeLabel} saved to tracking`, {
      description: `${value} will now appear in Explorer watchlists.`,
      action: {
        label: "View watchlist",
        onClick: () => navigate("/tracking/projects"),
      },
    });
  };
  const toggleHistorySort = (field: "timestamp" | "position" | "format") => {
    setHistorySort(prev => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "desc" };
    });
  };
  const sortIndicator = (field: "timestamp" | "position" | "format") => {
    if (historySort.field !== field) return "";
    return historySort.direction === "asc" ? "↑" : "↓";
  };
  const labelColumnClass = "inline-flex w-32 shrink-0 text-xs uppercase tracking-wide text-muted-foreground";

  const renderPreview = (format: string) => {
    const textStack = (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">
          <span className="h-6 w-6 rounded-full bg-muted" />
          <span>{article.domain.name}</span>
          <span className="text-muted-foreground/70">•</span>
          <span>2h</span>
        </div>
        <p className="text-base font-semibold leading-snug">{article.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-3">{article.summary}</p>
      </div>
    );

    const wrapper = (children: ReactNode, extra = "") => (
      <div className={`rounded-2xl border border-border/60 bg-background shadow-sm dark:bg-card ${extra}`}>{children}</div>
    );

    switch (format) {
      case "title-only":
        return wrapper(<div className="p-4">{textStack}</div>);
      case "title-image":
        return wrapper(
          <div className="flex items-start gap-3 p-4">
            <div className="flex-1">{textStack}</div>
            <div className="h-24 w-24 shrink-0 rounded-xl bg-muted" />
          </div>
        );
      case "image-top":
        return wrapper(
          <div className="overflow-hidden">
            <div className="h-32 w-full bg-muted" />
            <div className="p-4">{textStack}</div>
          </div>,
          "p-0"
        );
      default:
        return null;
    }
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider delayDuration={120}>
        <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Article Details</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-[0.65rem] uppercase tracking-[0.35em] text-muted-foreground">Article Overview</p>
                  <h2 className="text-3xl font-semibold">{article.title}</h2>
                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {article.url}
                    </a>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {article.badges.map(badge => {
                      const config = badgeConfig[badge];
                      if (!config) return null;
                      const Icon = config.icon;
                      return (
                        <Badge key={badge} variant="secondary" className={`${config.color} gap-1 text-xs`}>
                          <Icon className="h-3 w-3" />
                          {config.text}
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <LabelTooltip
                      label="SUMMARY"
                      description="Key Discover synopsis extracted from the article."
                      className={`${labelColumnClass} font-semibold`}
                    />
                    <p className={`text-sm text-muted-foreground ${summaryExpanded ? "" : "line-clamp-3"}`}>
                      {article.summary}{" "}
                      <Button
                        variant="link"
                        className="inline-flex px-0 text-xs align-baseline"
                        onClick={() => setSummaryExpanded(prev => !prev)}
                      >
                        {summaryExpanded ? "Collapse summary" : "Expand summary"}
                      </Button>
                    </p>
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:max-w-sm">
                    <div className="flex items-center gap-3">
                      <LabelTooltip
                        label="WORD COUNT"
                        description="Approximate number of words detected for this article."
                        className={labelColumnClass}
                      />
                      <span className="text-base font-semibold text-foreground">
                        {derivedWordCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <LabelTooltip
                        label="CHARACTER COUNT"
                        description="Total characters in the summary or article body."
                        className={labelColumnClass}
                      />
                      <span className="text-base font-semibold text-foreground">
                        {derivedCharacterCount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <LabelTooltip
                    label="INTEREST TOPICS"
                    description="Primary topical clusters associated with the article."
                    className={`${labelColumnClass} font-semibold`}
                  />
                  <div className="flex flex-1 flex-wrap gap-2">
                    {article.topics.map(topic => (
                      <div key={topic} className="group relative flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`rounded-full px-3 py-1 text-xs ${
                            topic === primaryTopic ? "border-primary bg-primary/10 text-primary" : ""
                          }`}
                        onClick={() => navigate(`/entity/${encodeURIComponent(topic)}`)}
                        >
                          {topic}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground"
                          onClick={event => {
                            event.stopPropagation();
                            handleTrack("topic", topic);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <LabelTooltip
                    label="CATEGORY"
                    description="High-level taxonomy bucket assigned to this content."
                    className={labelColumnClass}
                  />
                  <div className="group inline-flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="px-3 py-1 text-sm"
                      onClick={() => navigate(`/category/${encodeURIComponent(article.category)}`)}
                    >
                      {article.category}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground"
                      onClick={event => {
                        event.stopPropagation();
                        handleTrack("category", article.category);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <LabelTooltip
                        label="PUBLISHED"
                        description="Original publication timestamp reported by the crawler."
                        className={labelColumnClass}
                      />
                      <span>{formatDateTime(publishedDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <LabelTooltip
                        label="LAST MODIFIED"
                        description="Last detected update to the article content."
                        className={labelColumnClass}
                      />
                      <span>{formatDateTime(lastModifiedDate)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <LabelTooltip
                        label="PRIMARY REGION"
                        description="Region driving the majority of Discover impressions."
                        className={labelColumnClass}
                      />
                      <span>{article.primaryRegion}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <LabelTooltip
                        label="LANGUAGE"
                        description="Detected language of the article."
                        className={labelColumnClass}
                      />
                      <span>{article.language}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <LabelTooltip
                      label="LIFESPAN"
                      description="Time window the article remained discoverable in Discover."
                      className={labelColumnClass}
                    />
                    <span className="text-sm text-muted-foreground">{lifespanRange}</span>
                    <span className="text-sm font-semibold text-foreground">{lifespanMetric}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <LabelTooltip
                    label="PUBLISHER"
                    description="Source domain associated with this article."
                    className={labelColumnClass}
                  />
                  <div className="group inline-flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => navigate(`/publisher/${encodeURIComponent(article.domain.name)}`)}
                    >
                      <img src={article.domain.favicon} alt="" className="h-4 w-4" />
                      <span className="text-sm font-semibold">{article.domain.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 text-muted-foreground"
                      onClick={event => {
                        event.stopPropagation();
                        handleTrack("publisher", article.domain.name);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    DDS {article.domain.dds}
                  </Badge>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
                <div className="absolute inset-x-12 top-[6px] z-20 h-6 rounded-full bg-foreground/80 dark:bg-foreground/50" />
                <div className="relative rounded-[34px] border border-border/70 bg-gradient-to-b from-background via-background to-muted px-4 pb-5 pt-10 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Google Discover</span>
                      <span className="text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground">Preview</span>
                    </div>
                    <Tabs value={selectedFormat} onValueChange={setSelectedFormat}>
                      <TabsList className="w-full justify-start gap-1 bg-muted/60">
                        {article.displayFormats.map(format => (
                          <TabsTrigger key={format} value={format} className="text-[0.65rem]">
                            {formatLabels[format]}
                          </TabsTrigger>
                        ))}
                      </TabsList>
                    </Tabs>
                    <div className="rounded-2xl bg-muted/20 p-1">
                      {renderPreview(selectedFormat)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[0.5fr_1fr_1fr]">
          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Regions coverage</CardTitle>
              <Tabs value={regionMetric} onValueChange={value => setRegionMetric(value as "traffic" | "visibility")}>
                <TabsList className="bg-muted/60">
                  <TabsTrigger value="traffic" className="text-xs">
                    Traffic
                  </TabsTrigger>
                  <TabsTrigger value="visibility" className="text-xs">
                    Visibility
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="region"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name }) => name as string}
                  >
                    {pieData.map((entry, index) => {
                      const isActive = selectedRegion === entry.region;
                      const isDimmed = selectedRegion !== "All" && !isActive;
                      return (
                        <Cell
                          key={`region-${entry.region}`}
                          fill={regionColors[index % regionColors.length]}
                          opacity={isDimmed ? 0.4 : 1}
                          stroke={isActive ? "#0ea5e9" : "#fff"}
                          strokeWidth={isActive ? 3 : 1}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setSelectedRegion(prev => (prev === entry.region ? "All" : entry.region))
                          }
                        />
                      );
                    })}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value: number, _name, props) => [
                      value.toLocaleString(),
                      regionMetricLabel,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Traffic history</CardTitle>
                <p className="text-xs text-muted-foreground">Per region, {trafficMetricLabel.toLowerCase()}</p>
              </div>
              <Tabs value={trafficMetric} onValueChange={value => setTrafficMetric(value as "traffic" | "visibility")}>
                <TabsList className="bg-muted/60">
                  <TabsTrigger value="traffic" className="text-xs">
                    Traffic
                  </TabsTrigger>
                  <TabsTrigger value="visibility" className="text-xs">
                    Visibility
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stackedHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <RechartsTooltip
                    formatter={(value: number, name) => [
                      value.toLocaleString(),
                      `${name as string} ${trafficMetricLabel}`,
                    ]}
                  />
                  {regionKeys.map((region, index) => {
                    const color = regionColors[index % regionColors.length];
                    const isActive = selectedRegion === "All" || selectedRegion === region;
                    return (
                      <Area
                        key={region}
                        type="monotone"
                        dataKey={region}
                        stackId="regions"
                        stroke={color}
                        fill={color}
                        strokeWidth={isActive ? 2 : 1.25}
                        strokeOpacity={isActive ? 1 : 0.3}
                        fillOpacity={isActive ? 0.45 : 0.18}
                        activeDot={isActive ? { r: 3 } : false}
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Average position trend</CardTitle>
                <p className="text-xs text-muted-foreground">{selectedRegionLabel}</p>
              </div>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredHistory}>
                  <CartesianGrid strokeDasharray="4 4" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis reversed className="text-xs fill-muted-foreground" />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="avgPos" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle>History</CardTitle>
              <p className="text-sm text-muted-foreground">Every impression captured from Discover feed.</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap items-end gap-3">
                <div className="flex flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                  <span>From</span>
                  <input
                    type="datetime-local"
                    value={historyFilter.from}
                    onChange={event => setHistoryFilter(prev => ({ ...prev, from: event.target.value }))}
                    className="h-9 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="flex flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground">
                  <span>To</span>
                  <input
                    type="datetime-local"
                    value={historyFilter.to}
                    onChange={event => setHistoryFilter(prev => ({ ...prev, to: event.target.value }))}
                    className="h-9 rounded-md border border-border bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setHistoryFilter({ from: "", to: "" })}>
                  Reset
                </Button>
              </div>

              <div className="grid grid-cols-[1.2fr_0.6fr_0.6fr_auto] gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <button className="text-left" onClick={() => toggleHistorySort("timestamp")}>
                  Timestamp {sortIndicator("timestamp")}
                </button>
                <button className="text-left" onClick={() => toggleHistorySort("position")}>
                  Position {sortIndicator("position")}
                </button>
                <button className="text-left" onClick={() => toggleHistorySort("format")}>
                  Format {sortIndicator("format")}
                </button>
                <span className="text-right">Snapshot</span>
              </div>

              <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
                {sortedHistoryRecords.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    No impressions recorded for the selected range.
                  </div>
                ) : (
                  pagedHistoryRecords.map(record => (
                    <div
                      key={record.id}
                      className="grid grid-cols-[1.2fr_0.6fr_0.6fr_auto] items-center gap-3 px-4 py-3 text-sm"
                    >
                      <span className="font-medium text-foreground">{formatTimestamp(record.timestamp)}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">#{record.position}</span>
                        {record.delta !== 0 && (
                          <span className={`text-xs ${record.delta < 0 ? "text-green-600" : "text-red-500"}`}>
                            {record.delta > 0 ? `+${record.delta}` : record.delta}
                          </span>
                        )}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-zoom-in text-muted-foreground">{record.format}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="end">
                          <div className="h-24 w-36 overflow-hidden rounded-lg border border-border">
                            <img src={record.previewImage} alt={`${record.format} preview`} className="h-full w-full object-cover" />
                          </div>
                        </TooltipContent>
                      </Tooltip>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleSnapshotClick(record.snapshotId)}
                        >
                          View feed
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>
                  Page {historyPage} of {historyPageCount}
                </span>
                <div className="inline-flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={historyPage === 1}
                    onClick={() => setHistoryPage(prev => Math.max(1, prev - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={historyPage === historyPageCount}
                    onClick={() => setHistoryPage(prev => Math.min(historyPageCount, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Related</CardTitle>
              <p className="text-sm text-muted-foreground">Closest Discover neighbors sorted by freshness.</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr] gap-3 text-xs uppercase tracking-wide text-muted-foreground">
                <span>Title</span>
                <span>Domain</span>
                <span>Format</span>
                <span>Published</span>
                <span className="text-right">Similarity</span>
              </div>
              <div className="divide-y divide-border/60 rounded-2xl border border-border/60">
                {pagedRelatedArticles.map(article => (
                  <div
                    key={article.id}
                    className="grid grid-cols-[1.5fr_1fr_0.8fr_0.8fr_0.6fr] items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-muted/30 cursor-pointer"
                    onClick={() => navigate(`/article/${article.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-20 overflow-hidden rounded-lg border border-border/60">
                        <img src={article.thumbnail} alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="font-semibold leading-snug text-foreground">{article.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${article.domain}&sz=32`}
                        alt=""
                        className="h-4 w-4"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto rounded-md px-2 py-1 text-xs font-medium transition hover:bg-muted"
                        onClick={event => {
                          event.stopPropagation();
                          navigate(`/publisher/${encodeURIComponent(article.domain)}`);
                        }}
                      >
                        {article.domain}
                      </Button>
                    </div>
                    <span className="text-muted-foreground">{article.format}</span>
                    <span className="text-muted-foreground">{formatTimestamp(article.publishedAt)}</span>
                    <div className="text-right space-y-1">
                      <div className="text-primary font-semibold">{article.similarity}%</div>
                      <div className="text-xs text-muted-foreground">{article.entities.join(", ")}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                <span>
                  Page {relatedPage} of {relatedPageCount}
                </span>
                <div className="inline-flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={relatedPage === 1}
                    onClick={() => setRelatedPage(prev => Math.max(1, prev - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={relatedPage === relatedPageCount}
                    onClick={() => setRelatedPage(prev => Math.min(relatedPageCount, prev + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <p className="text-sm text-muted-foreground">Actionable recommendations backed by live signals.</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {insightHighlights.map(insight => (
                <div key={insight.title} className="rounded-2xl border border-border/60 bg-muted/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">{insight.title}</div>
                    <div className="text-xs text-muted-foreground">{insight.metricLabel}</div>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">{insight.metricValue}</div>
                  <p className="text-sm text-muted-foreground">{insight.detail}</p>
                  <div className="h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={insight.chartData}>
                        <Area
                          type="monotone"
                          dataKey="v"
                          stroke={insight.chartColor}
                          fill={insight.chartColor}
                          fillOpacity={0.25}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}

