import { useState, useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  Users, 
  Globe, 
  Repeat, 
  Sparkles, 
  Flame,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { mockPublications } from "@/data/mock-publications";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as ChartTooltip 
} from 'recharts';

// Reuse mockTrends to find the current trend
const mockTrends = [
  {
    id: "ai-generative-video",
    title: "Generative AI Video Revolution",
    summary: "Rapid advancement in AI video generation models like Sora and Kling is dominating tech discussions. This trend is driven by high interest in automation and creative industries.",
    category: "technology",
    publications: 1250,
    publicationsChange: 45,
    traffic: 850000,
    trafficChange: 120,
    entities: ["OpenAI Sora", "Kling AI", "Runway Gen-3", "Video Synthesis", "Artificial Intelligence"],
    trendType: "current",
    chartData: [
      { date: '01.01', publications: 120, traffic: 50000 },
      { date: '01.02', publications: 150, traffic: 80000 },
      { date: '01.03', publications: 300, traffic: 250000 },
      { date: '01.04', publications: 450, traffic: 400000 },
      { date: '01.05', publications: 600, traffic: 550000 },
      { date: '01.06', publications: 800, traffic: 700000 },
      { date: '01.07', publications: 1000, traffic: 800000 },
      { date: '01.08', publications: 1250, traffic: 850000 },
    ]
  }
];

export default function TrendDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const trend = mockTrends.find(t => t.id === id) || mockTrends[0];

  const publications = useMemo(() => {
    // Filter mock publications to match the trend's entities or category
    return mockPublications.filter(pub => 
      pub.entities.some(e => trend.entities.includes(e)) || 
      pub.category.toLowerCase() === trend.category.toLowerCase()
    ).slice(0, 15);
  }, [trend]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <Button 
          variant="ghost" 
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/trends")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trends
        </Button>

        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-red-500 bg-opacity-10 text-red-500 border-red-500 hover:bg-opacity-20">
                {trend.trendType.toUpperCase()}
              </Badge>
              <Badge variant="outline">{trend.category}</Badge>
            </div>
            <h1 className="text-4xl font-bold">{trend.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {trend.summary}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {trend.entities.map(entity => (
                <Badge 
                  key={entity} 
                  variant="secondary" 
                  className="px-3 py-1 cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => navigate(`/entity/${encodeURIComponent(entity)}`)}
                >
                  {entity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:w-[400px]">
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Publications</div>
                <div className="text-2xl font-bold">{trend.publications.toLocaleString()}</div>
                <div className="text-sm text-green-500 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +{trend.publicationsChange}%
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Est. Traffic</div>
                <div className="text-2xl font-bold">{(trend.traffic / 1000).toFixed(0)}K</div>
                <div className="text-sm text-green-500 font-medium flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +{trend.trafficChange}%
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Publication Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend.chartData}>
                    <defs>
                      <linearGradient id="colorPubs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="publications" 
                      stroke="#10b981" 
                      fillOpacity={1} 
                      fill="url(#colorPubs)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Traffic Dynamics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend.chartData}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="traffic" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorTraffic)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">Trend publications</CardTitle>
                <Badge variant="secondary" className="bg-muted/50">{publications.length} results</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border border-border bg-background">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-none border-r border-border"
                    onClick={() => setViewMode("table")}
                  >
                    <TableIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0 rounded-none"
                    onClick={() => setViewMode("cards")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {viewMode === "table" ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50">
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="w-[140px]">Publisher</TableHead>
                      <TableHead className="w-[180px]">Entities</TableHead>
                      <TableHead className="w-[100px]">Lifetime</TableHead>
                      <TableHead className="w-[100px]">Est Traffic</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {publications.map((pub) => (
                      <TableRow 
                        key={pub.id} 
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => navigate(`/article/${pub.id}`)}
                      >
                        <TableCell>
                          <img 
                            src={pub.image} 
                            alt={pub.title} 
                            className="w-16 h-10 object-cover rounded shadow-sm"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[400px]">
                            <div className="font-medium text-sm line-clamp-1">{pub.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{pub.publishedDate}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <img src={pub.favicon} alt={pub.domain} className="w-4 h-4 rounded-full" />
                            <span className="text-sm truncate">{pub.domain}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {pub.entities.slice(0, 2).map(e => (
                              <Badge key={e} variant="outline" className="text-[10px] py-0">{e}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium">{pub.lifetime}</TableCell>
                        <TableCell className="text-sm font-medium text-primary">{pub.estTraffic}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {publications.map((pub) => (
                  <Card key={pub.id} className="overflow-hidden hover:border-primary transition-all cursor-pointer group">
                    <img src={pub.image} alt={pub.title} className="w-full h-32 object-cover" />
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <img src={pub.favicon} alt={pub.domain} className="w-3 h-3 rounded-full" />
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{pub.domain}</span>
                      </div>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {pub.title}
                      </h3>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs text-muted-foreground">{pub.publishedDate}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium">{pub.lifetime}</span>
                          <span className="text-xs font-bold text-primary">{pub.estTraffic}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
