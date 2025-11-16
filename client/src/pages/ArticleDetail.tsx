import { ArrowLeft, Flame, Sparkles, Repeat, TrendingUp, Globe } from "lucide-react";
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

export default function ArticleDetail() {
  const [, navigate] = useLocation();

  const article = {
    title: "AI Revolutionizes Content Discovery Across the Globe",
    badges: ["trending", "new", "wide_geo"],
    summary:
      "Across multiple regions, publishers are experimenting with AI-generated summaries and adaptive layouts to increase engagement in Discover. This article unpacks what works, what doesn't, and which tactics will remain compliant with Google's guidance.",
    displayFormats: ["title-only", "title-image", "image-top"],
    topics: ["Artificial Intelligence", "Publishing", "Discover Optimization", "Content Strategy"],
    category: "Technology",
    publicationDate: "2025-11-13T09:30:00Z",
    firstSeen: "2025-11-13T10:05:00Z",
    lastSeen: "2025-11-14T04:25:00Z",
    domain: {
      name: "techradar.com",
      favicon: "https://techradar.com/favicon.ico",
      dds: 88,
    },
    metrics: {
      words: 1230,
      images: 14,
      extraEntities: ["Google", "OpenAI", "YouTube", "EU Commission"],
    },
  };

  const trafficHistory = [
    { date: "Nov 10", total: 12, new: 4 },
    { date: "Nov 11", total: 24, new: 10 },
    { date: "Nov 12", total: 52, new: 18 },
    { date: "Nov 13", total: 78, new: 22 },
    { date: "Nov 14", total: 95, new: 30 },
  ];

  const positionHistory = [
    { date: "Nov 10", avgPos: 5.2 },
    { date: "Nov 11", avgPos: 4.7 },
    { date: "Nov 12", avgPos: 4.1 },
    { date: "Nov 13", avgPos: 3.6 },
    { date: "Nov 14", avgPos: 3.2 },
  ];

  const regionDistribution = [
    { region: "US", value: 45 },
    { region: "UK", value: 20 },
    { region: "IN", value: 15 },
    { region: "CA", value: 12 },
    { region: "DE", value: 8 },
  ];

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

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
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

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Summary</div>
                  <p className={`text-sm text-muted-foreground ${summaryExpanded ? "" : "line-clamp-3"}`}>
                    {article.summary}
                  </p>
                  <Button variant="link" className="px-0" onClick={() => setSummaryExpanded(prev => !prev)}>
                    {summaryExpanded ? "Collapse summary" : "Expand summary"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Interest topics
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {article.topics.map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 items-center text-sm">
                  <span className="text-muted-foreground">Category:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-3 py-1 text-sm"
                    onClick={() => navigate(`/category/${encodeURIComponent(article.category)}`)}
                  >
                    {article.category}
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-sm">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">Published</div>
                    <div>{new Date(article.publicationDate).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">First seen</div>
                    <div>{new Date(article.firstSeen).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">Last seen</div>
                    <div>{new Date(article.lastSeen).toLocaleString()}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1"
                    onClick={() => window.open(`https://${article.domain.name}`, "_blank")}
                  >
                    <img src={article.domain.favicon} alt="" className="h-4 w-4" />
                    <span className="text-sm font-semibold">{article.domain.name}</span>
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
            <CardHeader>
              <CardTitle>Regions coverage</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionDistribution}
                    dataKey="value"
                    nameKey="region"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={3}
                  >
                    {regionDistribution.map((entry, index) => (
                      <Cell
                        key={`region-${entry.region}`}
                        fill={["#38bdf8", "#f97316", "#10b981", "#6366f1", "#facc15"][index % 5]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic history</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="total" stroke="#0ea5e9" fill="#38bdf8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="new" stroke="#facc15" fill="#fde047" fillOpacity={0.4} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average position trend</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={positionHistory}>
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
      </div>
    </DashboardLayout>
  );
}
