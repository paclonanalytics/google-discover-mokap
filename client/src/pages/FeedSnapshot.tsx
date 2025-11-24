import { ArrowLeft } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type FeedFormat = "image-top" | "image-left" | "title-only" | "full-bleed";

type FeedArticle = {
  id: string;
  title: string;
  domain: string;
  timeAgo: string;
  excerpt: string;
  image?: string;
  format: FeedFormat;
  type: "Article" | "Brief" | "Deep dive";
  category: string;
  entities: string[];
  dds: number;
  avgPosition: number;
  lifetimeHours: number;
  estTraffic: string;
  readingMinutes: number;
  badges?: string[];
};

const baseFeed: FeedArticle[] = [
  {
    id: "story-1",
    title: "Publishers race to personalize Discover cards with AI layouts",
    domain: "wired.com",
    timeAgo: "4 min ago",
    excerpt: "Teams blend AI authored blurbs with editorial curation to keep Discover cards fresh.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    format: "image-top",
    type: "Deep dive",
    category: "Media",
    entities: ["AI layouts", "Discover"],
    dds: 86,
    avgPosition: 3.4,
    lifetimeHours: 18,
    estTraffic: "32k",
    readingMinutes: 5,
    badges: ["trending"],
  },
  {
    id: "story-2",
    title: "EU regulators eye transparency labels for synthetic media",
    domain: "ft.com",
    timeAgo: "9 min ago",
    excerpt: "Draft guidance clarifies how transparent labels should appear inside Discover.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop",
    format: "image-left",
    type: "Article",
    category: "Policy",
    entities: ["EU", "Synthetic media"],
    dds: 78,
    avgPosition: 5.1,
    lifetimeHours: 9,
    estTraffic: "21k",
    readingMinutes: 4,
  },
  {
    id: "story-3",
    title: "How multi-language newsrooms stretch a single scoop",
    domain: "thenextweb.com",
    timeAgo: "12 min ago",
    excerpt: "Localized decks help one investigation appear in five unique Discover slots.",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&auto=format&fit=crop",
    format: "title-only",
    type: "Article",
    category: "Media",
    entities: ["Localization", "Multi-language"],
    dds: 74,
    avgPosition: 6.2,
    lifetimeHours: 7,
    estTraffic: "16k",
    readingMinutes: 3,
  },
  {
    id: "story-4",
    title: "Designers rethink Discover CTA density for dark mode",
    domain: "smashingmagazine.com",
    timeAgo: "15 min ago",
    excerpt: "Micro-interactions around bookmark chips can quietly boost session depth.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop",
    format: "image-left",
    type: "Deep dive",
    category: "Design",
    entities: ["Dark mode", "CTA density"],
    dds: 69,
    avgPosition: 8.1,
    lifetimeHours: 5,
    estTraffic: "9k",
    readingMinutes: 6,
  },
  {
    id: "story-5",
    title: "AI sports recaps dominate weekend Discover slots",
    domain: "espn.com",
    timeAgo: "22 min ago",
    excerpt: "Automated roundups get human polish before hitting the evening feed.",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop",
    format: "full-bleed",
    type: "Brief",
    category: "Sports",
    entities: ["AI recap", "Weekend"],
    dds: 91,
    avgPosition: 2.7,
    lifetimeHours: 10,
    estTraffic: "44k",
    readingMinutes: 4,
  },
  {
    id: "story-6",
    title: "Local weather cards experiment with haptic feedback",
    domain: "9to5google.com",
    timeAgo: "35 min ago",
    excerpt: "Pixel devices may pulse when a Discover alert contains severe weather data.",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&auto=format&fit=crop",
    format: "image-top",
    type: "Article",
    category: "Weather",
    entities: ["Haptics", "Pixel"],
    dds: 65,
    avgPosition: 9.4,
    lifetimeHours: 6,
    estTraffic: "8k",
    readingMinutes: 2,
  },
  {
    id: "story-7",
    title: "Gaming publishers lean into episodic Discover drops",
    domain: "ign.com",
    timeAgo: "41 min ago",
    excerpt: "Teasing narrative DLC via Discover helps rebuild hype between releases.",
    image: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?w=800&auto=format&fit=crop",
    format: "image-left",
    type: "Article",
    category: "Gaming",
    entities: ["Episodic drops", "DLC"],
    dds: 72,
    avgPosition: 4.8,
    lifetimeHours: 11,
    estTraffic: "19k",
    readingMinutes: 5,
  },
  {
    id: "story-8",
    title: "Finance creators test charts rendered directly inside tiles",
    domain: "bloomberg.com",
    timeAgo: "52 min ago",
    excerpt: "Inline spark charts promise faster comprehension without tapping through.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop",
    format: "title-only",
    type: "Brief",
    category: "Finance",
    entities: ["Spark charts", "Creators"],
    dds: 84,
    avgPosition: 3.9,
    lifetimeHours: 12,
    estTraffic: "25k",
    readingMinutes: 3,
  },
  {
    id: "story-9",
    title: "Food bloggers see success with looping motion covers",
    domain: "bonappetit.com",
    timeAgo: "1 h ago",
    excerpt: "Short, boomerang-style hero images increase dwell time on culinary cards.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&auto=format&fit=crop",
    format: "image-top",
    type: "Article",
    category: "Food",
    entities: ["Loop motion", "Culinary"],
    dds: 68,
    avgPosition: 7.3,
    lifetimeHours: 8,
    estTraffic: "13k",
    readingMinutes: 4,
  },
  {
    id: "story-10",
    title: "Space beat returns as Artemis rehearsals resume",
    domain: "space.com",
    timeAgo: "1 h ago",
    excerpt: "NASA invites indie journalists to embed Discover-ready dispatches from the pad.",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop",
    format: "full-bleed",
    type: "Deep dive",
    category: "Science",
    entities: ["Artemis", "NASA"],
    dds: 88,
    avgPosition: 3.2,
    lifetimeHours: 14,
    estTraffic: "28k",
    readingMinutes: 7,
  },
];

const feedSnapshots: Record<string, FeedArticle[]> = {
  default: baseFeed,
  "2025-11-14-0425": baseFeed,
  "2025-11-14-0110": [...baseFeed.slice(5), ...baseFeed.slice(0, 5)],
  "2025-11-13-2145": [...baseFeed.slice(2), ...baseFeed.slice(0, 2)],
  "2025-11-13-1605": [...baseFeed.slice(3), ...baseFeed.slice(0, 3)],
};

const snapshotMeta: Record<
  string,
  {
    capturedAt: string;
    notes: string;
    region: string;
    language: string;
  }
> = {
  default: {
    capturedAt: "Nov 14, 04:25 UTC",
    notes: "Default Discover composition.",
    region: "United States",
    language: "English",
  },
  "2025-11-14-0425": {
    capturedAt: "Nov 14, 04:25 UTC",
    notes: "Trending tech-heavy feed overnight.",
    region: "United States",
    language: "English",
  },
  "2025-11-14-0110": {
    capturedAt: "Nov 14, 01:10 UTC",
    notes: "Sports + finance mix before US morning.",
    region: "Canada",
    language: "English",
  },
  "2025-11-13-2145": {
    capturedAt: "Nov 13, 21:45 UTC",
    notes: "Pre-curfew mobile session example.",
    region: "United Kingdom",
    language: "English",
  },
  "2025-11-13-1605": {
    capturedAt: "Nov 13, 16:05 UTC",
    notes: "Afternoon ENG feed leaning on lifestyle.",
    region: "Australia",
    language: "English",
  },
};

const formatBadge: Record<FeedFormat, string> = {
  "image-top": "Image on top",
  "image-left": "Image left",
  "title-only": "Title only",
  "full-bleed": "Full bleed",
};

const FeedSnapshot = () => {
  const [, navigate] = useLocation();
  const [match, params] = useRoute<{ snapshotId: string }>("/feed/:snapshotId");
  const snapshotId = match ? params.snapshotId : "default";
  const feed = feedSnapshots[snapshotId] ?? feedSnapshots.default;
  const meta = snapshotMeta[snapshotId] ?? snapshotMeta.default;

  const renderCard = (article: FeedArticle) => {
    const commonMeta = (
      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.25em] text-muted-foreground">
        <span>{article.domain}</span>
        <span>{article.timeAgo}</span>
      </div>
    );

    const excerpt = (
      <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
    );

    if (article.format === "title-only") {
      return (
        <div className="space-y-2 rounded-2xl border border-border/70 bg-background p-4">
          {commonMeta}
          <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
          {excerpt}
        </div>
      );
    }

    if (article.format === "image-left") {
      return (
        <div className="flex gap-3 rounded-2xl border border-border/70 bg-background p-3">
          <div className="h-24 w-24 overflow-hidden rounded-xl bg-muted">
            {article.image && <img src={article.image} alt="" className="h-full w-full object-cover" />}
          </div>
          <div className="flex flex-1 flex-col gap-2">
            {commonMeta}
            <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
            {excerpt}
          </div>
        </div>
      );
    }

    if (article.format === "full-bleed") {
      return (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-background">
          {article.image && <img src={article.image} alt="" className="h-48 w-full object-cover" />}
          <div className="space-y-2 px-4 py-3">
            {commonMeta}
            <h3 className="text-lg font-semibold leading-snug">{article.title}</h3>
            {excerpt}
          </div>
        </div>
      );
    }

    // image-top default
    return (
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-background">
        {article.image && <img src={article.image} alt="" className="h-40 w-full object-cover" />}
        <div className="space-y-2 px-4 py-3">
          {commonMeta}
          <h3 className="text-base font-semibold leading-snug">{article.title}</h3>
          {excerpt}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-semibold">Google Discover Feed</h1>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <CardTitle>Feed snapshot {snapshotId}</CardTitle>
                <p className="text-sm text-muted-foreground">{meta.notes}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Captured {meta.capturedAt}
                </Badge>
                <Badge variant="outline" className="border-border/80 text-muted-foreground">
                  {meta.region}
                </Badge>
                <Badge variant="outline" className="border-border/80 text-muted-foreground">
                  {meta.language}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feed.map(article => (
              <div
                key={article.id}
                className="rounded-2xl border border-border/70 bg-background/60 p-4 transition hover:border-primary/40 hover:bg-muted/20 cursor-pointer space-y-4"
                onClick={() => navigate(`/article/${article.id}`)}
              >
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative h-32 w-full overflow-hidden rounded-xl border border-border/60 bg-muted md:w-48">
                    {article.image && <img src={article.image} alt="" className="h-full w-full object-cover" />}
                    <Badge className="absolute left-3 top-3 bg-black/70 text-[0.65rem] uppercase tracking-wide">
                      {formatBadge[article.format]}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{article.domain}</span>
                      <span>•</span>
                      <span>{article.timeAgo}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug">{article.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{article.excerpt}</p>
                    {article.badges && (
                      <div className="flex flex-wrap gap-2">
                        {article.badges.map(badge => (
                          <Badge key={badge} variant="secondary" className="bg-primary/10 text-primary">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Type</div>
                    <div className="font-semibold">{article.type}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Publisher</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-1 h-auto rounded-md px-2 py-1 text-sm font-medium transition hover:bg-muted"
                      onClick={event => {
                        event.stopPropagation();
                        navigate(`/publisher/${encodeURIComponent(article.domain)}`);
                      }}
                    >
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${article.domain}&sz=32`}
                        alt=""
                        className="mr-2 h-4 w-4"
                      />
                      {article.domain}
                    </Button>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">DDS</div>
                    <div className="font-semibold">{article.dds}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Entities</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {article.entities.map(entity => (
                        <Badge key={entity} variant="outline" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Category</div>
                    <div className="font-semibold">{article.category}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Lifetime</div>
                    <div className="font-semibold">{article.lifetimeHours}h</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Avg Pos</div>
                    <div className="font-semibold">#{article.avgPosition.toFixed(1)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Est traffic</div>
                    <div className="font-semibold">{article.estTraffic}</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FeedSnapshot;

