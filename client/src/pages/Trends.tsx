import { useEffect, useMemo, useRef, useState } from "react";
import { DateRange } from "react-day-picker";
import { Calendar, Compass, Search, TrendingUp, Clock, CalendarDays, TreePine, ArrowUpRight, Users, MessageSquare, Filter } from "lucide-react";
import { useLocation, Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  { value: "lifestyle", label: "Lifestyle" },
] as const;

const PERIOD_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "24h", label: "24 hours" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "custom", label: "Custom period" },
] as const;

interface Trend {
  id: string;
  title: string;
  summary: string;
  category: string;
  publications: number;
  publicationsChange: number;
  traffic: number;
  trafficChange: number;
  entities: string[];
  trendType: "current" | "short-term" | "seasonal" | "evergreen";
  publicationsTrend: number[];
  trafficTrend: number[];
}

const mockTrends: Trend[] = [
  // Current Trends
  {
    id: "ai-generative-video",
    title: "Generative AI Video Revolution",
    summary: "Rapid advancement in AI video generation models like Sora and Kling is dominating tech discussions.",
    category: "technology",
    publications: 1250,
    publicationsChange: 45,
    traffic: 850000,
    trafficChange: 120,
    entities: ["OpenAI Sora", "Kling AI", "Runway Gen-3", "Video Synthesis"],
    trendType: "current",
    publicationsTrend: [100, 150, 300, 450, 600, 800, 1000, 1250],
    trafficTrend: [50, 100, 250, 400, 550, 700, 800, 850],
  },
  {
    id: "ar-glasses-surge",
    title: "AR Glasses Market Growth",
    summary: "New consumer AR glasses are gaining traction as competitors to Apple Vision Pro emerge.",
    category: "technology",
    publications: 890,
    publicationsChange: 32,
    traffic: 420000,
    trafficChange: 65,
    entities: ["Meta Orion", "Snap Spectacles", "Apple Vision", "AR Tech"],
    trendType: "current",
    publicationsTrend: [200, 300, 450, 600, 700, 800, 850, 890],
    trafficTrend: [100, 150, 200, 250, 300, 350, 400, 420],
  },
  {
    id: "space-tourism-2026",
    title: "Commercial Space Travel Peaks",
    summary: "Increase in scheduled commercial space flights and orbital tourism interest.",
    category: "technology",
    publications: 450,
    publicationsChange: 110,
    traffic: 1200000,
    trafficChange: 85,
    entities: ["SpaceX", "Blue Origin", "Virgin Galactic", "Orbital Reef"],
    trendType: "current",
    publicationsTrend: [50, 80, 120, 200, 300, 380, 420, 450],
    trafficTrend: [200, 400, 600, 800, 950, 1050, 1150, 1200],
  },
  {
    id: "quantum-computing-breakthrough",
    title: "Quantum Computing Milestones",
    summary: "Recent breakthroughs in error correction are bringing practical quantum computers closer to reality.",
    category: "technology",
    publications: 670,
    publicationsChange: 28,
    traffic: 340000,
    trafficChange: 42,
    entities: ["IBM Quantum", "Google Sycamore", "Qubits", "Quantum Supremacy"],
    trendType: "current",
    publicationsTrend: [300, 350, 400, 480, 550, 600, 640, 670],
    trafficTrend: [150, 180, 220, 250, 280, 310, 330, 340],
  },
  {
    id: "renewable-energy-storage",
    title: "Next-Gen Battery Storage",
    summary: "Innovation in solid-state batteries and long-duration storage for renewable energy grids.",
    category: "technology",
    publications: 920,
    publicationsChange: 15,
    traffic: 560000,
    trafficChange: 24,
    entities: ["Solid-state", "Lithium", "Grid Storage", "Green Tech"],
    trendType: "current",
    publicationsTrend: [700, 750, 780, 820, 850, 880, 900, 920],
    trafficTrend: [400, 430, 460, 490, 510, 530, 550, 560],
  },

  // Short-term Trends
  {
    id: "crypto-etf-impact",
    title: "Spot Ether ETF Approval Impact",
    summary: "Short-term spike in financial analysis following the regulatory shifts for Ethereum ETFs.",
    category: "finance",
    publications: 450,
    publicationsChange: 310,
    traffic: 620000,
    trafficChange: 450,
    entities: ["Ethereum", "SEC", "ETF", "Crypto Regulation"],
    trendType: "short-term",
    publicationsTrend: [20, 30, 45, 120, 350, 410, 440, 450],
    trafficTrend: [10, 15, 25, 150, 480, 560, 600, 620],
  },
  {
    id: "fed-rate-decision",
    title: "Federal Reserve Interest Rates",
    summary: "Immediate market reaction and speculation regarding the latest Fed interest rate decisions.",
    category: "finance",
    publications: 2100,
    publicationsChange: 540,
    traffic: 3500000,
    trafficChange: 620,
    entities: ["Federal Reserve", "Inflation", "Interest Rates", "Wall Street"],
    trendType: "short-term",
    publicationsTrend: [100, 200, 400, 800, 1500, 1800, 2000, 2100],
    trafficTrend: [500, 1000, 1500, 2000, 2800, 3100, 3400, 3500],
  },
  {
    id: "hurricane-season-start",
    title: "Early Season Hurricane Alerts",
    summary: "Sudden spike in coverage as the first major storm of the season forms in the Atlantic.",
    category: "health",
    publications: 1450,
    publicationsChange: 890,
    traffic: 4800000,
    trafficChange: 1200,
    entities: ["Hurricane", "Weather Service", "Emergency Prep", "Atlantic"],
    trendType: "short-term",
    publicationsTrend: [10, 20, 50, 150, 500, 900, 1300, 1450],
    trafficTrend: [5, 10, 100, 800, 2000, 3500, 4500, 4800],
  },
  {
    id: "celebrity-event-viral",
    title: "Viral Red Carpet Moments",
    summary: "Trending discussion around unexpected fashion choices at a major award ceremony.",
    category: "entertainment",
    publications: 3200,
    publicationsChange: 1200,
    traffic: 8900000,
    trafficChange: 2500,
    entities: ["Met Gala", "Red Carpet", "Fashion", "Celebrity"],
    trendType: "short-term",
    publicationsTrend: [50, 100, 300, 1000, 2500, 3000, 3150, 3200],
    trafficTrend: [100, 200, 1000, 4000, 7500, 8500, 8800, 8900],
  },
  {
    id: "tech-earnings-surge",
    title: "Big Tech Earnings Reports",
    summary: "Brief but intense interest in quarterly financial results from major tech giants.",
    category: "finance",
    publications: 1800,
    publicationsChange: 420,
    traffic: 2100000,
    trafficChange: 580,
    entities: ["Earnings Report", "NVIDIA", "Microsoft", "Stock Market"],
    trendType: "short-term",
    publicationsTrend: [50, 120, 250, 600, 1200, 1500, 1750, 1800],
    trafficTrend: [100, 250, 500, 900, 1500, 1800, 2000, 2100],
  },

  // Seasonal Trends
  {
    id: "olympics-2024-prep",
    title: "Paris 2024 Olympic Preparation",
    summary: "Surge in articles about Paris infrastructure, athlete qualifications, and tourism for the upcoming games.",
    category: "sports",
    publications: 3200,
    publicationsChange: 15,
    traffic: 2400000,
    trafficChange: 35,
    entities: ["Paris 2024", "Olympic Village", "Athlete Safety", "Seine River"],
    trendType: "seasonal",
    publicationsTrend: [1500, 1800, 2100, 2400, 2700, 2900, 3100, 3200],
    trafficTrend: [800, 1100, 1400, 1700, 1900, 2100, 2300, 2400],
  },
  {
    id: "back-to-school-2025",
    title: "Back to School Tech Guide",
    summary: "Annual peak in interest for laptops, tablets, and student productivity tools.",
    category: "technology",
    publications: 1100,
    publicationsChange: 25,
    traffic: 1800000,
    trafficChange: 40,
    entities: ["Education Tech", "Student Laptops", "Productivity", "Back to School"],
    trendType: "seasonal",
    publicationsTrend: [200, 350, 500, 700, 850, 950, 1050, 1100],
    trafficTrend: [300, 500, 800, 1100, 1400, 1600, 1750, 1800],
  },
  {
    id: "holiday-gift-guides",
    title: "Ultimate Holiday Gift Guides",
    summary: "Year-end surge in curated shopping lists and consumer electronics recommendations.",
    category: "lifestyle",
    publications: 4500,
    publicationsChange: 18,
    traffic: 6700000,
    trafficChange: 22,
    entities: ["Gift Ideas", "Black Friday", "Shopping", "Holiday Season"],
    trendType: "seasonal",
    publicationsTrend: [500, 1000, 1800, 2800, 3500, 4000, 4300, 4500],
    trafficTrend: [800, 1500, 2500, 4000, 5500, 6200, 6500, 6700],
  },
  {
    id: "summer-travel-trends",
    title: "Summer 2026 Travel Destinatons",
    summary: "Predicting the most popular vacation spots for the upcoming summer season.",
    category: "lifestyle",
    publications: 950,
    publicationsChange: 12,
    traffic: 1400000,
    trafficChange: 15,
    entities: ["Travel", "Vacation", "Europe", "Eco-tourism"],
    trendType: "seasonal",
    publicationsTrend: [400, 550, 680, 780, 850, 900, 930, 950],
    trafficTrend: [500, 750, 950, 1100, 1250, 1350, 1380, 1400],
  },
  {
    id: "spring-cleaning-gadgets",
    title: "Spring Cleaning & Home Org",
    summary: "Increased interest in smart home cleaning tools and minimalist organization trends.",
    category: "lifestyle",
    publications: 720,
    publicationsChange: 8,
    traffic: 380000,
    trafficChange: 10,
    entities: ["Smart Vacuum", "Organization", "Home Decor", "Minimalism"],
    trendType: "seasonal",
    publicationsTrend: [300, 420, 530, 610, 660, 690, 710, 720],
    trafficTrend: [150, 220, 280, 320, 350, 370, 375, 380],
  },

  // Evergreen Trends
  {
    id: "sustainable-fashion-2026",
    title: "Sustainable & Ethical Fashion",
    summary: "Long-term growth in consumer interest for eco-friendly materials and transparent supply chains.",
    category: "lifestyle",
    publications: 850,
    publicationsChange: 5,
    traffic: 450000,
    trafficChange: 8,
    entities: ["Recycled Fabrics", "Circular Fashion", "B-Corp", "Eco-labels"],
    trendType: "evergreen",
    publicationsTrend: [780, 790, 805, 815, 825, 835, 845, 850],
    trafficTrend: [410, 415, 420, 425, 435, 440, 445, 450],
  },
  {
    id: "mental-health-workplace",
    title: "Mental Health in the Workplace",
    summary: "Ongoing discussion about employee well-being, burnout prevention, and corporate culture.",
    category: "health",
    publications: 1600,
    publicationsChange: 4,
    traffic: 820000,
    trafficChange: 6,
    entities: ["Work-life Balance", "Burnout", "Wellness", "HR Policy"],
    trendType: "evergreen",
    publicationsTrend: [1450, 1480, 1510, 1540, 1560, 1580, 1590, 1600],
    trafficTrend: [750, 765, 780, 795, 805, 812, 818, 820],
  },
  {
    id: "remote-work-evolution",
    title: "The Future of Remote Work",
    summary: "Consistent interest in hybrid work models, digital nomadism, and remote collaboration tools.",
    category: "lifestyle",
    publications: 2400,
    publicationsChange: 3,
    traffic: 1500000,
    trafficChange: 5,
    entities: ["Hybrid Work", "Digital Nomad", "Zoom", "Slack"],
    trendType: "evergreen",
    publicationsTrend: [2200, 2250, 2300, 2330, 2360, 2380, 2390, 2400],
    trafficTrend: [1400, 1420, 1440, 1460, 1475, 1485, 1495, 1500],
  },
  {
    id: "personal-finance-literacy",
    title: "Personal Finance & Investing",
    summary: "Steady volume of content helping consumers manage debt, save, and invest for retirement.",
    category: "finance",
    publications: 3800,
    publicationsChange: 2,
    traffic: 2800000,
    trafficChange: 4,
    entities: ["Investing", "Savings", "Budgeting", "Retirement"],
    trendType: "evergreen",
    publicationsTrend: [3650, 3680, 3710, 3730, 3755, 3780, 3795, 3800],
    trafficTrend: [2650, 2680, 2710, 2740, 2765, 2780, 2795, 2800],
  },
  {
    id: "healthy-eating-habits",
    title: "Nutritional Science & Habits",
    summary: "Stable interest in diet trends, superfoods, and long-term health through nutrition.",
    category: "health",
    publications: 2100,
    publicationsChange: 3,
    traffic: 1900000,
    trafficChange: 5,
    entities: ["Keto", "Plant-based", "Intermittent Fasting", "Vitamins"],
    trendType: "evergreen",
    publicationsTrend: [1950, 1980, 2010, 2040, 2060, 2080, 2095, 2100],
    trafficTrend: [1750, 1780, 1810, 1840, 1860, 1880, 1895, 1900],
  },
];

const MiniTrendChart = ({ data, color }: { data: number[], color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 30;
  const width = 80;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
};

export default function Trends() {
  const [, navigate] = useLocation();
  const [country, setCountry] = useState("all");
  const [language, setLanguage] = useState("all");
  const [category, setCategory] = useState("all");
  const [period, setPeriod] = useState("week");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [customPopoverOpen, setCustomPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [trendTypeTab, setTrendTypeTab] = useState("all");

  const filteredTrends = useMemo(() => {
    return mockTrends.filter(trend => {
      if (category !== "all" && trend.category !== category) return false;
      if (trendTypeTab !== "all" && trend.trendType !== trendTypeTab) return false;
      if (searchQuery && !trend.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !trend.summary.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [category, trendTypeTab, searchQuery]);

  const trendsByType = useMemo(() => {
    return {
      current: filteredTrends.filter(t => t.trendType === "current"),
      shortTerm: filteredTrends.filter(t => t.trendType === "short-term"),
      seasonal: filteredTrends.filter(t => t.trendType === "seasonal"),
      evergreen: filteredTrends.filter(t => t.trendType === "evergreen"),
    };
  }, [filteredTrends]);

  const getTrendTypeBadge = (type: Trend["trendType"]) => {
    switch (type) {
      case "current": return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Current</Badge>;
      case "short-term": return <Badge variant="outline" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20">Short-term</Badge>;
      case "seasonal": return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Seasonal</Badge>;
      case "evergreen": return <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Evergreen</Badge>;
    }
  };

  return (
    <DashboardLayout
      filterCountry={country}
      setFilterCountry={setCountry}
      filterLanguage={language}
      setFilterLanguage={setLanguage}
      filterCategory={category}
      setFilterCategory={setCategory}
      period={period}
      setPeriod={setPeriod}
    >
      <div className="p-6 space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
            Discover Analysis
          </p>
          <h1 className="text-3xl font-bold text-foreground mt-2">Trends</h1>
          <p className="text-muted-foreground mt-1">
            Identify emerging and established content patterns in Google Discover.
          </p>
        </div>

        <div className="border border-border shadow-sm rounded-lg bg-card">
          <div className="py-4 px-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search trends or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[140px]">
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

                <Select value={period} onValueChange={setPeriod}>
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
                      <Button variant="outline" className="gap-2">
                        <Calendar className="w-4 h-4" />
                        {customRange?.from ? (
                          customRange.to ? (
                            <>
                              {customRange.from.toLocaleDateString()} - {customRange.to.toLocaleDateString()}
                            </>
                          ) : (
                            customRange.from.toLocaleDateString()
                          )
                        ) : (
                          "Select dates"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <CalendarComponent
                        mode="range"
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
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all" value={trendTypeTab} onValueChange={setTrendTypeTab} className="w-full">
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid grid-cols-5 w-full max-w-2xl">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="current" className="gap-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Current
                </TabsTrigger>
                <TabsTrigger value="short-term" className="gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Short-term
                </TabsTrigger>
                <TabsTrigger value="seasonal" className="gap-2">
                  <CalendarDays className="w-3.5 h-3.5" />
                  Seasonal
                </TabsTrigger>
                <TabsTrigger value="evergreen" className="gap-2">
                  <TreePine className="w-3.5 h-3.5" />
                  Evergreen
                </TabsTrigger>
              </TabsList>
              <div className="hidden md:block">
                <Badge variant="secondary" className="px-3 py-1">
                  {filteredTrends.length} trends found
                </Badge>
              </div>
            </div>

            <Card className="border-border/40 shadow-sm overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[300px]">Trend</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Publications</TableHead>
                    <TableHead className="text-right">Est. Traffic</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrends.length > 0 ? (
                    filteredTrends.map((trend) => (
                      <TableRow 
                        key={trend.id} 
                        className="cursor-pointer group"
                        onClick={() => navigate(`/trends/${trend.id}`)}
                      >
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {trend.title}
                            </div>
                            <div className="text-xs text-muted-foreground line-clamp-1 max-w-[400px]">
                              {trend.summary}
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {trend.entities.slice(0, 2).map(entity => (
                                <Badge key={entity} variant="outline" className="text-[10px] py-0 font-normal opacity-70">
                                  {entity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTrendTypeBadge(trend.trendType)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {trend.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="font-medium">{trend.publications.toLocaleString()}</div>
                            <div className="text-[10px] text-green-500 flex items-center gap-0.5">
                              <ArrowUpRight className="w-3 h-3" />
                              {trend.publicationsChange}%
                            </div>
                            <MiniTrendChart data={trend.publicationsTrend} color="#10b981" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="font-medium">{(trend.traffic / 1000).toFixed(0)}K</div>
                            <div className="text-[10px] text-green-500 flex items-center gap-0.5">
                              <ArrowUpRight className="w-3 h-3" />
                              {trend.trafficChange}%
                            </div>
                            <MiniTrendChart data={trend.trafficTrend} color="#3b82f6" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="group-hover:text-primary">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                        No trends found matching your current filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Card>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}

