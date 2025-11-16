import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  TrendingUp,
  Hash,
  BarChart3,
  Calendar,
  Repeat,
  Globe,
  TrendingUpIcon,
  Flame,
  Filter,
  Search,
  Sparkles,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Cell } from "recharts";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

// Mock data - Extended to 10 items
const popularMaterials = [
  {
    id: 1,
    image: "https://picsum.photos/seed/6092/400/300",
    title: "New AI Technologies Transform the Development Industry",
    publishedDate: "November 12, 2025",
    type: "Video",
    displayFormats: ["title-image"],
    badges: ["trending", "new"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 86,
    avgPosition: 3.0,
    entities: ["Programming", "Google", "Software", "Development"],
    category: "Science",
    lifetime: "8h",
    estTraffic: "80K",
  },
  {
    id: 2,
    image: "https://picsum.photos/seed/4293/400/300",
    title: "Cryptocurrency Market Analysis: What Awaits Investors in 2025",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["story", "title-image", "image-top"],
    badges: ["trending", "new"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 82,
    avgPosition: 3.0,
    entities: ["Nutrition", "Productivity", "Energy", "Food"],
    category: "Business",
    lifetime: "18h",
    estTraffic: "129K",
  },
  {
    id: 3,
    image: "https://picsum.photos/seed/7044/400/300",
    title: "Healthy Lifestyle: 10 Habits of Successful People",
    publishedDate: "November 11, 2025",
    type: "Video",
    displayFormats: ["story"],
    badges: ["reappeared", "new"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 74,
    avgPosition: 2.2,
    entities: ["Bitcoin", "Cryptocurrency", "Finance", "Investment"],
    category: "Technology",
    lifetime: "19h",
    estTraffic: "137K",
  },
  {
    id: 4,
    image: "https://picsum.photos/seed/8906/400/300",
    title: "Programming Revolution: Google's New Language",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["story", "title-image", "image-top"],
    badges: ["trending"],
    domain: "bloomberg.com",
    favicon: "https://bloomberg.com/favicon.ico",
    dds: 66,
    avgPosition: 2.7,
    entities: ["Electric Vehicles", "Tesla", "Transportation", "Sustainability"],
    category: "Finance",
    lifetime: "19h",
    estTraffic: "212K",
  },
  {
    id: 5,
    image: "https://picsum.photos/seed/2435/400/300",
    title: "Investment Strategies in Uncertain Times",
    publishedDate: "November 11, 2025",
    type: "Video",
    displayFormats: ["image-top"],
    badges: ["similar_region", "reappeared"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 91,
    avgPosition: 2.6,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Health",
    lifetime: "14h",
    estTraffic: "205K",
  },
  {
    id: 6,
    image: "https://picsum.photos/seed/6165/400/300",
    title: "Nutrition for Productivity: What to Eat for Maximum Energy",
    publishedDate: "November 12, 2025",
    type: "Video",
    displayFormats: ["story"],
    badges: ["wide_geo"],
    domain: "wired.com",
    favicon: "https://wired.com/favicon.ico",
    dds: 77,
    avgPosition: 2.1,
    entities: ["Programming", "Google", "Software", "Development"],
    category: "Health",
    lifetime: "20h",
    estTraffic: "111K",
  },
  {
    id: 7,
    image: "https://picsum.photos/seed/5205/400/300",
    title: "Climate Change: New Scientific Data",
    publishedDate: "November 11, 2025",
    type: "Video",
    displayFormats: ["story", "image-top"],
    badges: ["reappeared", "similar_region"],
    domain: "nytimes.com",
    favicon: "https://nytimes.com/favicon.ico",
    dds: 77,
    avgPosition: 2.2,
    entities: ["Programming", "Google", "Software", "Development"],
    category: "Health",
    lifetime: "21h",
    estTraffic: "177K",
  },
  {
    id: 8,
    image: "https://picsum.photos/seed/5754/400/300",
    title: "Electric Vehicles: The Future of Transportation is Here",
    publishedDate: "November 13, 2025",
    type: "Carousel",
    displayFormats: ["title-only", "title-image", "story"],
    badges: ["similar_region"],
    domain: "reuters.com",
    favicon: "https://reuters.com/favicon.ico",
    dds: 81,
    avgPosition: 3.0,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Technology",
    lifetime: "23h",
    estTraffic: "217K",
  },
  {
    id: 9,
    image: "https://picsum.photos/seed/3140/400/300",
    title: "Space Exploration: NASA's New Discoveries",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["title-only"],
    badges: ["similar_region"],
    domain: "bbc.com",
    favicon: "https://bbc.com/favicon.ico",
    dds: 78,
    avgPosition: 1.5,
    entities: ["Investment", "Strategy", "Economy", "Finance"],
    category: "Science",
    lifetime: "18h",
    estTraffic: "152K",
  },
  {
    id: 10,
    image: "https://picsum.photos/seed/1146/400/300",
    title: "Cybersecurity in 2025: Major Threats",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["title-only", "image-top", "story"],
    badges: ["reappeared"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 76,
    avgPosition: 3.7,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Finance",
    lifetime: "12h",
    estTraffic: "91K",
  },
  {
    id: 11,
    image: "https://picsum.photos/seed/8474/400/300",
    title: "Medical Breakthroughs: New Cancer Treatment Methods",
    publishedDate: "November 10, 2025",
    type: "Article",
    displayFormats: ["title-only"],
    badges: ["wide_geo"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 76,
    avgPosition: 4.2,
    entities: ["AI", "Technology", "Innovation", "Future"],
    category: "Technology",
    lifetime: "19h",
    estTraffic: "141K",
  },
  {
    id: 12,
    image: "https://picsum.photos/seed/3398/400/300",
    title: "Education of the Future: How Schools Will Change",
    publishedDate: "November 11, 2025",
    type: "Article",
    displayFormats: ["story"],
    badges: ["wide_geo", "similar_region"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 81,
    avgPosition: 2.3,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Science",
    lifetime: "12h",
    estTraffic: "208K",
  },
  {
    id: 13,
    image: "https://picsum.photos/seed/7600/400/300",
    title: "Financial Literacy: Where to Start",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["story", "image-top", "title-only"],
    badges: ["similar_region", "wide_geo"],
    domain: "cnn.com",
    favicon: "https://cnn.com/favicon.ico",
    dds: 95,
    avgPosition: 4.9,
    entities: ["Cybersecurity", "Privacy", "Technology", "Security"],
    category: "Business",
    lifetime: "20h",
    estTraffic: "107K",
  },
  {
    id: 14,
    image: "https://picsum.photos/seed/7993/400/300",
    title: "Psychology of Success: Productivity Secrets",
    publishedDate: "November 12, 2025",
    type: "Video",
    displayFormats: ["title-only", "title-image"],
    badges: ["similar_region"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 89,
    avgPosition: 2.0,
    entities: ["Bitcoin", "Cryptocurrency", "Finance", "Investment"],
    category: "Health",
    lifetime: "24h",
    estTraffic: "169K",
  },
  {
    id: 15,
    image: "https://picsum.photos/seed/864/400/300",
    title: "Travel After the Pandemic: New Trends",
    publishedDate: "November 13, 2025",
    type: "Carousel",
    displayFormats: ["story"],
    badges: ["reappeared"],
    domain: "nytimes.com",
    favicon: "https://nytimes.com/favicon.ico",
    dds: 79,
    avgPosition: 3.7,
    entities: ["Electric Vehicles", "Tesla", "Transportation", "Sustainability"],
    category: "Finance",
    lifetime: "24h",
    estTraffic: "137K",
  },
  {
    id: 16,
    image: "https://picsum.photos/seed/6874/400/300",
    title: "Sustainable Development: How Business is Changing Approach",
    publishedDate: "November 10, 2025",
    type: "Article",
    displayFormats: ["story", "image-top"],
    badges: ["reappeared"],
    domain: "cnn.com",
    favicon: "https://cnn.com/favicon.ico",
    dds: 66,
    avgPosition: 2.3,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Health",
    lifetime: "11h",
    estTraffic: "87K",
  },
  {
    id: 17,
    image: "https://picsum.photos/seed/5012/400/300",
    title: "Sports Technologies: Training Gadgets",
    publishedDate: "November 11, 2025",
    type: "Carousel",
    displayFormats: ["title-image", "image-top"],
    badges: [],
    domain: "nytimes.com",
    favicon: "https://nytimes.com/favicon.ico",
    dds: 85,
    avgPosition: 2.4,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Health",
    lifetime: "22h",
    estTraffic: "234K",
  },
  {
    id: 18,
    image: "https://picsum.photos/seed/5888/400/300",
    title: "Remote Work Culture: Best Practices",
    publishedDate: "November 11, 2025",
    type: "Video",
    displayFormats: ["title-only"],
    badges: [],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 74,
    avgPosition: 3.6,
    entities: ["Nutrition", "Productivity", "Energy", "Food"],
    category: "Business",
    lifetime: "13h",
    estTraffic: "105K",
  },
  {
    id: 19,
    image: "https://picsum.photos/seed/7453/400/300",
    title: "Neurotechnology: Brain-Computer Interfaces",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["title-image"],
    badges: [],
    domain: "healthline.com",
    favicon: "https://healthline.com/favicon.ico",
    dds: 77,
    avgPosition: 2.1,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Business",
    lifetime: "11h",
    estTraffic: "229K",
  },
  {
    id: 20,
    image: "https://picsum.photos/seed/6680/400/300",
    title: "Quantum Computers: Breakthrough in Computing",
    publishedDate: "November 10, 2025",
    type: "Article",
    displayFormats: ["story", "title-image"],
    badges: ["wide_geo", "reappeared"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 93,
    avgPosition: 4.0,
    entities: ["Bitcoin", "Cryptocurrency", "Finance", "Investment"],
    category: "Health",
    lifetime: "18h",
    estTraffic: "80K",
  },
  {
    id: 21,
    image: "https://picsum.photos/seed/8267/400/300",
    title: "Cybersecurity in 2025: Major Threats #21",
    publishedDate: "November 13, 2025",
    type: "Carousel",
    displayFormats: ["image-top", "title-image"],
    badges: ["wide_geo"],
    domain: "wired.com",
    favicon: "https://wired.com/favicon.ico",
    dds: 77,
    avgPosition: 3.1,
    entities: ["Bitcoin", "Cryptocurrency", "Finance", "Investment"],
    category: "Finance",
    lifetime: "15h",
    estTraffic: "242K",
  },
  {
    id: 22,
    image: "https://picsum.photos/seed/7440/400/300",
    title: "Quantum Computers: Breakthrough in Computing #22",
    publishedDate: "November 11, 2025",
    type: "Article",
    displayFormats: ["story"],
    badges: ["similar_region"],
    domain: "bbc.com",
    favicon: "https://bbc.com/favicon.ico",
    dds: 69,
    avgPosition: 1.6,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Finance",
    lifetime: "8h",
    estTraffic: "244K",
  },
  {
    id: 23,
    image: "https://picsum.photos/seed/809/400/300",
    title: "Sustainable Development: How Business is Changing Approach #23",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["title-image", "story", "image-top"],
    badges: [],
    domain: "reuters.com",
    favicon: "https://reuters.com/favicon.ico",
    dds: 68,
    avgPosition: 2.3,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Technology",
    lifetime: "13h",
    estTraffic: "112K",
  },
  {
    id: 24,
    image: "https://picsum.photos/seed/2906/400/300",
    title: "Cryptocurrency Market Analysis: What Awaits Investors in 2025 #24",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["title-only", "story", "title-image"],
    badges: ["similar_region", "wide_geo"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 83,
    avgPosition: 4.8,
    entities: ["Investment", "Strategy", "Economy", "Finance"],
    category: "Business",
    lifetime: "9h",
    estTraffic: "202K",
  },
  {
    id: 25,
    image: "https://picsum.photos/seed/9347/400/300",
    title: "Travel After the Pandemic: New Trends #25",
    publishedDate: "November 10, 2025",
    type: "Video",
    displayFormats: ["story"],
    badges: [],
    domain: "bloomberg.com",
    favicon: "https://bloomberg.com/favicon.ico",
    dds: 75,
    avgPosition: 2.6,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Finance",
    lifetime: "21h",
    estTraffic: "145K",
  },
  {
    id: 26,
    image: "https://picsum.photos/seed/2487/400/300",
    title: "Quantum Computers: Breakthrough in Computing #26",
    publishedDate: "November 12, 2025",
    type: "Article",
    displayFormats: ["title-image"],
    badges: ["reappeared", "similar_region"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 70,
    avgPosition: 4.2,
    entities: ["AI", "Technology", "Innovation", "Future"],
    category: "Technology",
    lifetime: "14h",
    estTraffic: "108K",
  },
  {
    id: 27,
    image: "https://picsum.photos/seed/3145/400/300",
    title: "Healthy Lifestyle: 10 Habits of Successful People #27",
    publishedDate: "November 11, 2025",
    type: "Video",
    displayFormats: ["image-top", "story"],
    badges: ["wide_geo"],
    domain: "wired.com",
    favicon: "https://wired.com/favicon.ico",
    dds: 87,
    avgPosition: 4.4,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Business",
    lifetime: "15h",
    estTraffic: "220K",
  },
  {
    id: 28,
    image: "https://picsum.photos/seed/4918/400/300",
    title: "Investment Strategies in Uncertain Times #28",
    publishedDate: "November 10, 2025",
    type: "Video",
    displayFormats: ["title-only", "title-image"],
    badges: [],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 72,
    avgPosition: 2.3,
    entities: ["Investment", "Strategy", "Economy", "Finance"],
    category: "Science",
    lifetime: "13h",
    estTraffic: "222K",
  },
  {
    id: 29,
    image: "https://picsum.photos/seed/3517/400/300",
    title: "Sustainable Development: How Business is Changing Approach #29",
    publishedDate: "November 10, 2025",
    type: "Article",
    displayFormats: ["title-only", "story", "title-image"],
    badges: ["similar_region"],
    domain: "wired.com",
    favicon: "https://wired.com/favicon.ico",
    dds: 89,
    avgPosition: 2.2,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Science",
    lifetime: "20h",
    estTraffic: "209K",
  },
  {
    id: 30,
    image: "https://picsum.photos/seed/3621/400/300",
    title: "Sports Technologies: Training Gadgets #30",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["story", "image-top"],
    badges: ["similar_region"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 68,
    avgPosition: 3.9,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Technology",
    lifetime: "23h",
    estTraffic: "142K",
  },
  {
    id: 31,
    image: "https://picsum.photos/seed/2554/400/300",
    title: "Medical Breakthroughs: New Cancer Treatment Methods #31",
    publishedDate: "November 10, 2025",
    type: "Carousel",
    displayFormats: ["title-only", "story"],
    badges: [],
    domain: "healthline.com",
    favicon: "https://healthline.com/favicon.ico",
    dds: 69,
    avgPosition: 2.6,
    entities: ["Electric Vehicles", "Tesla", "Transportation", "Sustainability"],
    category: "Science",
    lifetime: "20h",
    estTraffic: "178K",
  },
  {
    id: 32,
    image: "https://picsum.photos/seed/9242/400/300",
    title: "Quantum Computers: Breakthrough in Computing #32",
    publishedDate: "November 10, 2025",
    type: "Article",
    displayFormats: ["title-image", "story", "title-only"],
    badges: ["similar_region", "reappeared"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 84,
    avgPosition: 2.3,
    entities: ["AI", "Technology", "Innovation", "Future"],
    category: "Business",
    lifetime: "21h",
    estTraffic: "180K",
  },
  {
    id: 33,
    image: "https://picsum.photos/seed/4854/400/300",
    title: "New AI Technologies Transform the Development Industry #33",
    publishedDate: "November 12, 2025",
    type: "Video",
    displayFormats: ["image-top"],
    badges: [],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 73,
    avgPosition: 2.8,
    entities: ["Cybersecurity", "Privacy", "Technology", "Security"],
    category: "Science",
    lifetime: "17h",
    estTraffic: "245K",
  },
  {
    id: 34,
    image: "https://picsum.photos/seed/7438/400/300",
    title: "Investment Strategies in Uncertain Times #34",
    publishedDate: "November 13, 2025",
    type: "Article",
    displayFormats: ["story", "image-top"],
    badges: ["reappeared"],
    domain: "wired.com",
    favicon: "https://wired.com/favicon.ico",
    dds: 93,
    avgPosition: 2.8,
    entities: ["Health", "Wellness", "Lifestyle", "Nutrition"],
    category: "Health",
    lifetime: "15h",
    estTraffic: "235K",
  },
  {
    id: 35,
    image: "https://picsum.photos/seed/2895/400/300",
    title: "Programming Revolution: Google's New Language #35",
    publishedDate: "November 12, 2025",
    type: "Article",
    displayFormats: ["title-image"],
    badges: [],
    domain: "techcrunch.com",
    favicon: "https://techcrunch.com/favicon.ico",
    dds: 92,
    avgPosition: 3.7,
    entities: ["Cybersecurity", "Privacy", "Technology", "Security"],
    category: "Technology",
    lifetime: "11h",
    estTraffic: "93K",
  },
  {
    id: 36,
    image: "https://picsum.photos/seed/7611/400/300",
    title: "Neurotechnology: Brain-Computer Interfaces #36",
    publishedDate: "November 13, 2025",
    type: "Carousel",
    displayFormats: ["title-only", "title-image", "story"],
    badges: [],
    domain: "reuters.com",
    favicon: "https://reuters.com/favicon.ico",
    dds: 84,
    avgPosition: 1.5,
    entities: ["Bitcoin", "Cryptocurrency", "Finance", "Investment"],
    category: "Business",
    lifetime: "10h",
    estTraffic: "194K",
  },
  {
    id: 37,
    image: "https://picsum.photos/seed/5526/400/300",
    title: "Sustainable Development: How Business is Changing Approach #37",
    publishedDate: "November 10, 2025",
    type: "Carousel",
    displayFormats: ["story"],
    badges: [],
    domain: "techcrunch.com",
    favicon: "https://techcrunch.com/favicon.ico",
    dds: 88,
    avgPosition: 2.0,
    entities: ["Programming", "Google", "Software", "Development"],
    category: "Science",
    lifetime: "8h",
    estTraffic: "192K",
  },
  {
    id: 38,
    image: "https://picsum.photos/seed/4748/400/300",
    title: "Healthy Lifestyle: 10 Habits of Successful People #38",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["title-image"],
    badges: ["reappeared"],
    domain: "wired.com",
    favicon: "https://wired.com/favicon.ico",
    dds: 89,
    avgPosition: 1.6,
    entities: ["Health", "Wellness", "Lifestyle", "Nutrition"],
    category: "Health",
    lifetime: "11h",
    estTraffic: "213K",
  },
  {
    id: 39,
    image: "https://picsum.photos/seed/9824/400/300",
    title: "Quantum Computers: Breakthrough in Computing #39",
    publishedDate: "November 12, 2025",
    type: "Article",
    displayFormats: ["image-top"],
    badges: ["similar_region", "wide_geo"],
    domain: "techcrunch.com",
    favicon: "https://techcrunch.com/favicon.ico",
    dds: 65,
    avgPosition: 4.7,
    entities: ["Health", "Wellness", "Lifestyle", "Nutrition"],
    category: "Health",
    lifetime: "21h",
    estTraffic: "168K",
  },
  {
    id: 40,
    image: "https://picsum.photos/seed/5127/400/300",
    title: "Electric Vehicles: The Future of Transportation is Here #40",
    publishedDate: "November 10, 2025",
    type: "Carousel",
    displayFormats: ["title-only", "story"],
    badges: [],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 88,
    avgPosition: 3.6,
    entities: ["Programming", "Google", "Software", "Development"],
    category: "Science",
    lifetime: "16h",
    estTraffic: "133K",
  },
  {
    id: 41,
    image: "https://picsum.photos/seed/600/400/300",
    title: "Programming Revolution: Google's New Language #41",
    publishedDate: "November 13, 2025",
    type: "Article",
    displayFormats: ["story", "title-only"],
    badges: ["reappeared"],
    domain: "reuters.com",
    favicon: "https://reuters.com/favicon.ico",
    dds: 87,
    avgPosition: 3.0,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Business",
    lifetime: "24h",
    estTraffic: "164K",
  },
  {
    id: 42,
    image: "https://picsum.photos/seed/1327/400/300",
    title: "Climate Change: New Scientific Data #42",
    publishedDate: "November 11, 2025",
    type: "Article",
    displayFormats: ["title-only"],
    badges: [],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 85,
    avgPosition: 2.8,
    entities: ["Investment", "Strategy", "Economy", "Finance"],
    category: "Technology",
    lifetime: "18h",
    estTraffic: "248K",
  },
  {
    id: 43,
    image: "https://picsum.photos/seed/7401/400/300",
    title: "New AI Technologies Transform the Development Industry #43",
    publishedDate: "November 11, 2025",
    type: "Article",
    displayFormats: ["story", "title-only"],
    badges: ["reappeared"],
    domain: "bloomberg.com",
    favicon: "https://bloomberg.com/favicon.ico",
    dds: 86,
    avgPosition: 2.9,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Technology",
    lifetime: "13h",
    estTraffic: "159K",
  },
  {
    id: 44,
    image: "https://picsum.photos/seed/451/400/300",
    title: "Sustainable Development: How Business is Changing Approach #44",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["title-only"],
    badges: ["wide_geo"],
    domain: "bbc.com",
    favicon: "https://bbc.com/favicon.ico",
    dds: 78,
    avgPosition: 3.1,
    entities: ["AI", "Technology", "Innovation", "Future"],
    category: "Science",
    lifetime: "24h",
    estTraffic: "177K",
  },
  {
    id: 45,
    image: "https://picsum.photos/seed/735/400/300",
    title: "Investment Strategies in Uncertain Times #45",
    publishedDate: "November 13, 2025",
    type: "Video",
    displayFormats: ["story"],
    badges: ["reappeared"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 90,
    avgPosition: 2.2,
    entities: ["Health", "Wellness", "Lifestyle", "Nutrition"],
    category: "Technology",
    lifetime: "9h",
    estTraffic: "173K",
  },
  {
    id: 46,
    image: "https://picsum.photos/seed/7148/400/300",
    title: "Healthy Lifestyle: 10 Habits of Successful People #46",
    publishedDate: "November 11, 2025",
    type: "Article",
    displayFormats: ["title-only"],
    badges: ["wide_geo"],
    domain: "forbes.com",
    favicon: "https://forbes.com/favicon.ico",
    dds: 92,
    avgPosition: 2.8,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Health",
    lifetime: "17h",
    estTraffic: "117K",
  },
  {
    id: 47,
    image: "https://picsum.photos/seed/2936/400/300",
    title: "Space Exploration: NASA's New Discoveries #47",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["title-image"],
    badges: ["reappeared"],
    domain: "bloomberg.com",
    favicon: "https://bloomberg.com/favicon.ico",
    dds: 77,
    avgPosition: 3.6,
    entities: ["Climate", "Science", "Environment", "Research"],
    category: "Health",
    lifetime: "17h",
    estTraffic: "159K",
  },
  {
    id: 48,
    image: "https://picsum.photos/seed/4217/400/300",
    title: "Neurotechnology: Brain-Computer Interfaces #48",
    publishedDate: "November 12, 2025",
    type: "Video",
    displayFormats: ["title-image", "image-top", "title-only"],
    badges: ["reappeared", "wide_geo"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 95,
    avgPosition: 1.0,
    entities: ["Space", "NASA", "Exploration", "Science"],
    category: "Finance",
    lifetime: "18h",
    estTraffic: "92K",
  },
  {
    id: 49,
    image: "https://picsum.photos/seed/616/400/300",
    title: "Neurotechnology: Brain-Computer Interfaces #49",
    publishedDate: "November 12, 2025",
    type: "Carousel",
    displayFormats: ["title-image", "story"],
    badges: [],
    domain: "techcrunch.com",
    favicon: "https://techcrunch.com/favicon.ico",
    dds: 68,
    avgPosition: 1.1,
    entities: ["Electric Vehicles", "Tesla", "Transportation", "Sustainability"],
    category: "Health",
    lifetime: "17h",
    estTraffic: "87K",
  },
  {
    id: 50,
    image: "https://picsum.photos/seed/7515/400/300",
    title: "Programming Revolution: Google's New Language #50",
    publishedDate: "November 13, 2025",
    type: "Article",
    displayFormats: ["story"],
    badges: ["reappeared"],
    domain: "theguardian.com",
    favicon: "https://theguardian.com/favicon.ico",
    dds: 87,
    avgPosition: 2.9,
    entities: ["Bitcoin", "Cryptocurrency", "Finance", "Investment"],
    category: "Business",
    lifetime: "14h",
    estTraffic: "135K",
  }
];

const popularEntities = [
  { name: "Artificial Intelligence", count: 1247, trend: "+15%", sparkline: [85, 88, 90, 95, 100, 105, 110, 115, 120, 125, 130, 135] },
  { name: "Climate Change", count: 982, trend: "+8%", sparkline: [75, 77, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96] },
  { name: "Electric Vehicles", count: 876, trend: "+22%", sparkline: [60, 65, 70, 75, 82, 90, 98, 105, 112, 120, 128, 136] },
  { name: "Cryptocurrency", count: 754, trend: "-5%", sparkline: [95, 92, 88, 85, 82, 78, 75, 72, 68, 65, 62, 60] },
  { name: "Space Exploration", count: 623, trend: "+12%", sparkline: [45, 48, 50, 53, 56, 59, 62, 65, 68, 71, 74, 77] },
];

const popularCategories = [
  { name: "Technology", count: 2847, trend: "+18%", color: "from-blue-500 to-cyan-500", sparkline: [180, 190, 200, 210, 220, 235, 250, 265, 280, 295, 310, 325] },
  { name: "Finance", count: 1923, trend: "+12%", color: "from-green-500 to-emerald-500", sparkline: [140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195] },
  { name: "Health", count: 1654, trend: "+9%", color: "from-pink-500 to-rose-500", sparkline: [120, 125, 128, 132, 136, 140, 144, 148, 152, 156, 160, 164] },
  { name: "Business", count: 1432, trend: "+15%", color: "from-purple-500 to-violet-500", sparkline: [100, 105, 110, 115, 122, 130, 138, 146, 154, 162, 170, 178] },
  { name: "Science", count: 987, trend: "+6%", color: "from-orange-500 to-amber-500", sparkline: [80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102] },
];

const popularStories = [
  { title: "Breakthrough in Quantum Computing", mentions: 342, sources: 28 },
  { title: "New EU Climate Policy", mentions: 289, sources: 45 },
  { title: "iPhone 16 Launch", mentions: 267, sources: 52 },
  { title: "US Presidential Election 2024", mentions: 234, sources: 67 },
];

const popularDomains = [
  { domain: "nytimes.com", articles: 156, dds: 95, trend: "+18%", favicon: "https://nytimes.com/favicon.ico", sparkline: [12, 15, 14, 18, 16, 20, 19, 22, 21, 24, 23, 26] },
  { domain: "bbc.com", articles: 143, dds: 93, trend: "+15%", favicon: "https://bbc.com/favicon.ico", sparkline: [10, 12, 11, 14, 13, 16, 15, 18, 17, 20, 19, 22] },
  { domain: "cnn.com", articles: 128, dds: 89, trend: "+12%", favicon: "https://cnn.com/favicon.ico", sparkline: [8, 10, 9, 12, 11, 14, 13, 16, 15, 18, 17, 20] },
  { domain: "theguardian.com", articles: 112, dds: 91, trend: "+14%", favicon: "https://theguardian.com/favicon.ico", sparkline: [9, 11, 10, 13, 12, 15, 14, 17, 16, 19, 18, 21] },
  { domain: "reuters.com", articles: 105, dds: 88, trend: "+10%", favicon: "https://reuters.com/favicon.ico", sparkline: [7, 9, 8, 11, 10, 13, 12, 15, 14, 17, 16, 19] },
];

const hourlyPublications = [
  { hour: "00:00", total: 52, new: 18 },
  { hour: "02:00", total: 64, new: 20 },
  { hour: "04:00", total: 61, new: 19 },
  { hour: "06:00", total: 75, new: 24 },
  { hour: "08:00", total: 91, new: 33 },
  { hour: "10:00", total: 98, new: 35 },
  { hour: "12:00", total: 105, new: 38 },
  { hour: "14:00", total: 99, new: 30 },
  { hour: "16:00", total: 120, new: 42 },
  { hour: "18:00", total: 110, new: 36 },
  { hour: "20:00", total: 95, new: 28 },
  { hour: "22:00", total: 88, new: 25 },
  { hour: "Now", total: 130, new: 55 },
];

const HourlyTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || payload.length === 0) return null;
  const [totalBar, newBar] = payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-sm">
      <div className="font-medium text-foreground">{totalBar.payload.hour}</div>
      <div className="text-muted-foreground">Total: {totalBar.value}</div>
      <div className="text-muted-foreground">New: {newBar?.value ?? 0}</div>
    </div>
  );
};

const searchHistory = [
  { query: "Technology, USA, Live", timestamp: "2 hours ago" },
  { query: "Finance, Global, Last 24h", timestamp: "5 hours ago" },
  { query: "Health, Europe, Last Week", timestamp: "1 day ago" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { theme } = useTheme();
  const isDarkTheme = theme === "dark";
  const axisColor = isDarkTheme ? "rgba(248,250,252,0.85)" : "rgba(15,23,42,0.75)";
  const axisLineColor = isDarkTheme ? "rgba(148,163,184,0.4)" : "rgba(15,23,42,0.2)";
  const totalBarColor = isDarkTheme ? "hsl(215 100% 72%)" : "hsl(221 90% 60%)";
  const newBarColor = isDarkTheme ? "hsl(45 100% 65%)" : "hsl(35 100% 55%)";
  const pendingNewColor = isDarkTheme ? "rgba(255, 213, 79, 0.35)" : "rgba(255, 193, 7, 0.4)";
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  
  // Main filter states (synced between main block and sticky header)
  const [filterCountry, setFilterCountry] = useState("usa");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFormat, setFilterFormat] = useState("all");
  const [filterPublisherMain, setFilterPublisherMain] = useState("all");
  const [period, setPeriod] = useState("live");
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(20);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [trackingItem, setTrackingItem] = useState<{type: string, value: string} | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [cardsSummary, setCardsSummary] = useState<Record<number, boolean>>({});
  const handleRowClick = (id: number) => {
    navigate(`/article/${id}`);
  };
const formatLabels: Record<string, string> = {
  "title-only": "Title only",
  "title-image": "Title + image",
  "image-top": "Image on top",
  story: "Story",
};

const badgeConfig: Record<
  string,
  { color: string; icon: React.ComponentType<{ className?: string }>; label: string; short: string }
> = {
  reappeared: {
    color: "bg-blue-100 text-blue-600",
    icon: Repeat,
    label: "Material reappeared in Discover",
    short: "Reappeared",
  },
  wide_geo: {
    color: "bg-green-100 text-green-600",
    icon: TrendingUp,
    label: "Material has wide GEO coverage",
    short: "Wide GEO",
  },
  trending: {
    color: "bg-red-100 text-red-600",
    icon: Flame,
    label: "Material is gaining popularity",
    short: "Trending",
  },
  new: {
    color: "bg-yellow-100 text-yellow-600",
    icon: Sparkles,
    label: "New material",
    short: "New",
  },
};

const renderFormatIcon = (format: string, idx: number) => (
  <TooltipProvider delayDuration={100} key={`${format}-${idx}`}>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center justify-center rounded-full border border-border/60 p-1.5 text-foreground">
          {format === "title-only" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
              <rect x="4" y="10" width="12" height="2" rx="1" fill="currentColor" />
            </svg>
          )}
          {format === "title-image" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="12" height="2" rx="1" fill="currentColor" />
              <rect x="3" y="10" width="10" height="2" rx="1" fill="currentColor" />
              <rect x="16" y="6" width="5" height="6" rx="1" fill="currentColor" opacity="0.5" />
            </svg>
          )}
          {format === "image-top" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="8" rx="1" fill="currentColor" opacity="0.5" />
              <rect x="4" y="14" width="12" height="2" rx="1" fill="currentColor" />
              <rect x="4" y="18" width="10" height="2" rx="1" fill="currentColor" />
            </svg>
          )}
          {format === "story" && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="8" y="3" width="8" height="18" rx="1" fill="currentColor" opacity="0.5" />
              <circle cx="12" cy="8" r="2" fill="white" />
            </svg>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>{formatLabels[format] || format}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const renderBadgeIcon = (badge: string, idx: number) => {
  const config = badgeConfig[badge];
  if (!config) return null;
  const Icon = config.icon;
  return (
    <TooltipProvider delayDuration={100} key={`${badge}-${idx}`}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium ${config.color}`}>
            <Icon className="h-3 w-3" />
            {config.short}
          </div>
        </TooltipTrigger>
        <TooltipContent>{config.label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const renderEntitiesBadges = (material: typeof popularMaterials[number]) => (
  <div className="flex flex-wrap gap-1">
    {material.entities.map((entity, idx) => (
      <Badge 
        key={idx} 
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/entity/${encodeURIComponent(entity)}`);
        }}
        variant={idx === 0 ? "default" : "outline"}
        className={`text-[10px] px-1.5 py-0 cursor-pointer transition-colors ${
          idx === 0 
            ? "bg-primary text-primary-foreground font-semibold hover:bg-primary/90" 
            : "border-border/50 hover:bg-primary/10"
        }`}
      >
        {entity}
      </Badge>
    ))}
  </div>
);

  const renderPreviewCard = (material: typeof popularMaterials[number]) => {
    const primaryFormat = material.displayFormats[0] || "title-image";

    const previewByFormat = () => {
      switch (primaryFormat) {
        case "title-only":
          return (
            <div className="rounded-xl border border-border bg-background p-4">
              <p className="text-base font-semibold text-foreground line-clamp-3">{material.title}</p>
              <span className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                <img src={material.favicon} className="w-3.5 h-3.5" alt="" />
                {material.domain}
              </span>
            </div>
          );
        case "title-image":
          return (
            <div className="rounded-xl border border-border bg-background p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-base font-semibold text-foreground line-clamp-3">{material.title}</p>
                <span className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                  <img src={material.favicon} className="w-3.5 h-3.5" alt="" />
                  {material.domain}
                </span>
              </div>
              <img src={material.image} alt={material.title} className="h-24 w-32 rounded-lg object-cover" />
            </div>
          );
        case "story":
          return (
            <div className="rounded-2xl border border-border bg-background p-3 w-full max-w-[220px]">
              <div className="rounded-xl overflow-hidden aspect-[9/16] bg-muted">
                <img src={material.image} alt={material.title} className="h-full w-full object-cover" />
              </div>
              <p className="mt-3 text-sm font-semibold text-foreground line-clamp-3">{material.title}</p>
              <span className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <img src={material.favicon} className="w-3.5 h-3.5" alt="" />
                {material.domain}
              </span>
            </div>
          );
        case "image-top":
        default:
          return (
            <div className="rounded-xl border border-border bg-background overflow-hidden">
              <img src={material.image} alt={material.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                <p className="text-base font-semibold text-foreground line-clamp-3">{material.title}</p>
                <span className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                  <img src={material.favicon} className="w-3.5 h-3.5" alt="" />
                  {material.domain}
                </span>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-xs">
          {material.badges.map(renderBadgeIcon)}
        </div>
        {previewByFormat()}
      </div>
    );
  };
  
  // Advanced filter states
  const [filterType, setFilterType] = useState<string>("");
  const [filterDisplayFormat, setFilterDisplayFormat] = useState<string>("");
  const [filterPublisher, setFilterPublisher] = useState<string>("");
  const [filterDDSMin, setFilterDDSMin] = useState<string>("");
  const [filterDDSMax, setFilterDDSMax] = useState<string>("");
  const [filterEntity, setFilterEntity] = useState<string>("");
  const [filterCategoryAdv, setFilterCategoryAdv] = useState<string>("");
  const [filterLifetimeMin, setFilterLifetimeMin] = useState<string>("");
  const [filterLifetimeMax, setFilterLifetimeMax] = useState<string>("");
  const [filterAvgPosMin, setFilterAvgPosMin] = useState<string>("");
  const [filterAvgPosMax, setFilterAvgPosMax] = useState<string>("");
  const [filterTrafficMin, setFilterTrafficMin] = useState<string>("");
  const [filterTrafficMax, setFilterTrafficMax] = useState<string>("");
  const [filterBadges, setFilterBadges] = useState<string[]>([]);
  
  // Hover states for widget items
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredPublisher, setHoveredPublisher] = useState<string | null>(null);

  // Filter materials based on selected filters
  const filteredMaterials = popularMaterials.filter((material) => {
    // Widget filters
    if (selectedEntity && !material.entities.includes(selectedEntity)) return false;
    if (selectedCategory && material.category !== selectedCategory) return false;
    if (selectedPublisher && material.domain !== selectedPublisher) return false;
    
    // Advanced filters
    if (filterType && filterType !== "all" && material.type !== filterType) return false;
    if (filterDisplayFormat && filterDisplayFormat !== "all" && !material.displayFormats.includes(filterDisplayFormat)) return false;
    if (filterPublisher && filterPublisher !== "all" && material.domain !== filterPublisher) return false;
    if (filterDDSMin && material.dds < parseInt(filterDDSMin)) return false;
    if (filterDDSMax && material.dds > parseInt(filterDDSMax)) return false;
    if (filterEntity && !material.entities.some(e => e.toLowerCase().includes(filterEntity.toLowerCase()))) return false;
    if (filterCategoryAdv && filterCategoryAdv !== "all" && material.category !== filterCategoryAdv) return false;
    
    // Lifetime filter (convert to hours)
    if (filterLifetimeMin || filterLifetimeMax) {
      const lifetimeHours = parseInt(material.lifetime.replace('h', ''));
      if (filterLifetimeMin && lifetimeHours < parseInt(filterLifetimeMin)) return false;
      if (filterLifetimeMax && lifetimeHours > parseInt(filterLifetimeMax)) return false;
    }
    
    if (filterAvgPosMin && material.avgPosition < parseFloat(filterAvgPosMin)) return false;
    if (filterAvgPosMax && material.avgPosition > parseFloat(filterAvgPosMax)) return false;
    
    // Traffic filter (convert K to number)
    if (filterTrafficMin || filterTrafficMax) {
      const trafficNum = parseInt(material.estTraffic.replace('K', ''));
      if (filterTrafficMin && trafficNum < parseInt(filterTrafficMin)) return false;
      if (filterTrafficMax && trafficNum > parseInt(filterTrafficMax)) return false;
    }
    
    // Badges filter
    if (filterBadges.length > 0) {
      const hasAllBadges = filterBadges.every(badge => material.badges.includes(badge));
      if (!hasAllBadges) return false;
    }
    
    return true;
  });

  // Visible materials for infinity scroll
  const visibleMaterials = filteredMaterials.slice(0, visibleCount);

  // Scroll handler for sticky filters
  useEffect(() => {
    const handleScroll = () => {
      if (filterSectionRef.current) {
        const rect = filterSectionRef.current.getBoundingClientRect();
        // Show sticky filters when the block is completely gone + 10px gap
        const shouldShow = rect.bottom <= -10;
        setShowStickyFilters(shouldShow);
      }
    };

    // Find the main scrollable container
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    // Check on mount
    handleScroll();

    // Add scroll listener to main container
    mainContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mainContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Infinity scroll handler
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const windowHeight = target.clientHeight;
      const docHeight = target.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 200 && visibleCount < filteredMaterials.length) {
        setVisibleCount(prev => Math.min(prev + 10, filteredMaterials.length));
      }
    };

    // Find the main scrollable container
    const mainContainer = document.querySelector('main');
    if (!mainContainer) return;

    mainContainer.addEventListener('scroll', handleScroll);
    return () => mainContainer.removeEventListener('scroll', handleScroll);
  }, [visibleCount, filteredMaterials.length]);


  return (
    <DashboardLayout 
      showStickyFilters={showStickyFilters}
      filterCountry={filterCountry}
      setFilterCountry={setFilterCountry}
      filterLanguage={filterLanguage}
      setFilterLanguage={setFilterLanguage}
      filterCategory={filterCategory}
      setFilterCategory={setFilterCategory}
      filterFormat={filterFormat}
      setFilterFormat={setFilterFormat}
      filterPublisher={filterPublisherMain}
      setFilterPublisher={setFilterPublisherMain}
      period={period}
      setPeriod={setPeriod}
    >
      <div className="p-6 space-y-6">
        {/* Search Form with Simplified Filters */}
        <div ref={filterSectionRef} className="border border-border shadow-sm rounded-lg bg-card">
          <div className="py-4 px-6">
            {/* Header and Filters in One Row */}
            <div className="flex items-center justify-between">
              {/* Left: Title with article count */}
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-foreground">
                  Discover Explorer
                </h2>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {filteredMaterials.length} {filteredMaterials.length === 1 ? 'article' : 'articles'}
                </Badge>
              </div>

              {/* Right: Filters without labels */}
              <div className="flex items-center gap-2">
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger className="h-9 text-sm w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="russia">Russia</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="france">France</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterLanguage} onValueChange={setFilterLanguage}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All languages</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterFormat} onValueChange={setFilterFormat}>
                  <SelectTrigger className="h-9 text-sm w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="listicle">Listicle</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPublisherMain} onValueChange={setFilterPublisherMain}>
                  <SelectTrigger className="h-9 text-sm w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="mozilla">Mozilla</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="h-9 text-sm w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        Live
                      </div>
                    </SelectItem>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="custom">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        Select period
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Search Button - Semrush green */}
                <Button className="h-9 bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Widgets - Four columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Top Entities */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Top Entities</CardTitle>
                <span className="text-xs text-muted-foreground font-medium">Publications</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {popularEntities.map((entity, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredEntity(entity.name)}
                    onMouseLeave={() => setHoveredEntity(null)}
                    onClick={() => navigate(`/entity/${encodeURIComponent(entity.name)}`)}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group ${
                      selectedEntity === entity.name ? 'bg-primary/10 border border-primary/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackingItem({type: 'entity', value: entity.name});
                                setTrackingDialogOpen(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Add to tracking</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span className="font-medium text-sm text-foreground">{entity.name}</span>
                    </div>
                    <div className="flex items-center gap-1 relative">
                      <span className="text-xs text-muted-foreground font-medium w-12 text-right">{entity.count}</span>
                      <svg width="60" height="20" className="opacity-70">
                        {entity.sparkline.map((val, i) => (
                          <rect
                            key={i}
                            x={i * 5}
                            y={20 - (val / Math.max(...entity.sparkline)) * 18}
                            width="3.5"
                            height={(val / Math.max(...entity.sparkline)) * 18}
                            fill="currentColor"
                            className="text-primary"
                          />
                        ))}
                      </svg>
                      <Badge
                        variant="secondary"
                        className={`text-xs w-14 justify-center ${entity.trend.startsWith("+") ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"} border-0`}
                      >
                        {entity.trend}
                      </Badge>
                      {hoveredEntity === entity.name && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-1 rounded">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEntity(entity.name);
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                  }}
                                  className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                                >
                                  <Filter className="w-4 h-4 text-primary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Filter table</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/entity/${encodeURIComponent(entity.name)}`);
                                  }}
                                  className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                                >
                                  <Search className="w-4 h-4 text-primary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Open entity</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Categories */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Top Categories</CardTitle>
                <span className="text-xs text-muted-foreground font-medium">Publications</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {popularCategories.map((category, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredCategory(category.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group ${
                      selectedCategory === category.name ? 'bg-primary/10 border border-primary/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackingItem({type: 'category', value: category.name});
                                setTrackingDialogOpen(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Add to tracking</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`}></div>
                      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-1 relative">
                      <span className="text-xs text-muted-foreground font-medium w-12 text-right">{category.count}</span>
                      <svg width="60" height="20" className="opacity-70">
                        {category.sparkline.map((val, i) => (
                          <rect
                            key={i}
                            x={i * 5}
                            y={20 - (val / Math.max(...category.sparkline)) * 18}
                            width="3.5"
                            height={(val / Math.max(...category.sparkline)) * 18}
                            fill="currentColor"
                            className="text-primary"
                          />
                        ))}
                      </svg>
                      <Badge
                        variant="secondary"
                        className="text-xs w-14 justify-center bg-accent/10 text-accent border-0"
                      >
                        {category.trend}
                      </Badge>
                      {hoveredCategory === category.name && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-1 rounded">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCategory(category.name);
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                  }}
                                  className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                                >
                                  <Filter className="w-4 h-4 text-primary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Filter table</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/category/${encodeURIComponent(category.name)}`);
                                  }}
                                  className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                                >
                                  <Search className="w-4 h-4 text-primary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Open category</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Publishers */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Top Publishers</CardTitle>
                <span className="text-xs text-muted-foreground font-medium">Publications</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {popularDomains.map((domain, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredPublisher(domain.domain)}
                    onMouseLeave={() => setHoveredPublisher(null)}
                    onClick={() => navigate(`/publisher/${encodeURIComponent(domain.domain)}`)}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group ${
                      selectedPublisher === domain.domain ? 'bg-primary/10 border border-primary/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <TooltipProvider delayDuration={100}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setTrackingItem({type: 'publisher', value: domain.domain});
                                setTrackingDialogOpen(true);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20 rounded"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-primary">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>Add to tracking</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <img
                        src={domain.favicon}
                        alt=""
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{domain.domain}</span>
                      <div className="relative group/tooltip">
                        <Badge variant="outline" className="text-xs border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 text-primary font-semibold cursor-help">
                          {domain.dds}
                        </Badge>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-lg border border-border opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 whitespace-nowrap z-50">
                          DDS - Discover Domain Score<br />
                          domain visibility metric in Google Discover
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 relative">
                      <span className="text-xs text-muted-foreground font-medium w-12 text-right">{domain.articles}</span>
                      <svg width="60" height="20" className="opacity-70">
                        {domain.sparkline.map((val, i) => (
                          <rect
                            key={i}
                            x={i * 5}
                            y={20 - (val / Math.max(...domain.sparkline)) * 18}
                            width="3.5"
                            height={(val / Math.max(...domain.sparkline)) * 18}
                            fill="currentColor"
                            className="text-primary"
                          />
                        ))}
                      </svg>
                      <Badge
                        variant="secondary"
                        className={`text-xs w-14 justify-center ${domain.trend.startsWith("+") ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"} border-0`}
                      >
                        {domain.trend}
                      </Badge>
                      {hoveredPublisher === domain.domain && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-background/95 backdrop-blur-sm px-1 rounded">
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPublisher(domain.domain);
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                                  }}
                                  className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                                >
                                  <Filter className="w-4 h-4 text-primary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Filter table</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/publisher/${encodeURIComponent(domain.domain)}`);
                                  }}
                                  className="p-1.5 hover:bg-primary/20 rounded transition-colors"
                                >
                                  <Search className="w-4 h-4 text-primary" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>Open publisher</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publications */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Publications</CardTitle>
                <span className="text-xs text-muted-foreground font-medium">Live feed, last 24h</span>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={hourlyPublications} barCategoryGap={24}>
                    <XAxis
                      dataKey="hour"
                      tickLine={false}
                      axisLine={{ stroke: axisLineColor, strokeWidth: 1 }}
                      tick={{
                        fontSize: 11,
                        fill: axisColor,
                        fontWeight: 600,
                      }}
                    />
                    <RechartsTooltip cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }} content={<HourlyTooltip />} />
                    <defs>
                      <pattern id="barPending" patternUnits="userSpaceOnUse" width="8" height="8">
                        <rect width="8" height="8" fill="transparent" />
                        <path
                          d="M0 0L8 8ZM8 0L0 8Z"
                          stroke={totalBarColor}
                          strokeWidth="0.5"
                          opacity={0.35}
                        />
                      </pattern>
                    </defs>
                    <Bar dataKey="total" stackId="pubs" fill={totalBarColor} barSize={22}>
                      {hourlyPublications.map((entry, index) => (
                        <Cell
                          key={`total-${entry.hour}-${index}`}
                          fill={entry.hour === "Now" ? "url(#barPending)" : totalBarColor}
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="new" stackId="pubs" fill={newBarColor} barSize={22}>
                      {hourlyPublications.map((entry, index) => (
                        <Cell
                          key={`new-${entry.hour}-${index}`}
                          fill={entry.hour === "Now" ? pendingNewColor : newBarColor}
                        />
                      ))}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>


        {/* Popular Materials - Reorganized Table */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">Live publications</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="hidden sm:flex rounded-md border border-border bg-background">
                  <Button
                    variant={viewMode === "table" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none border-r border-border"
                    onClick={() => setViewMode("table")}
                  >
                    <TableIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-none"
                    onClick={() => setViewMode("cards")}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setFilterDialogOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-1.5">
                    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Filters
                </Button>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "new", label: "New", icon: Sparkles },
                    { key: "trending", label: "Trending", icon: Flame },
                    { key: "wide_geo", label: "Wide GEO", icon: Globe },
                    { key: "reappeared", label: "Reappeared", icon: Repeat },
                  ].map(badge => (
                    <Button
                      key={badge.key}
                      variant={filterBadges.includes(badge.key) ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs flex items-center gap-1"
                      onClick={() => {
                        setFilterBadges(prev =>
                          prev.includes(badge.key)
                            ? prev.filter(b => b !== badge.key)
                            : [...prev, badge.key]
                        );
                      }}
                    >
                      <badge.icon className="h-3.5 w-3.5" />
                      {badge.label}
                    </Button>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs ml-auto"
                onClick={() => {
                  const headers = ['Title', 'Type', 'Publisher', 'DDS', 'Avg Pos', 'Lifetime', 'Est Traffic'];
                  const rows = filteredMaterials.map(m => [
                    m.title,
                    m.type,
                    m.domain,
                    m.dds,
                    m.avgPosition,
                    m.lifetime,
                    m.estTraffic
                  ]);
                  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'popular_publications.csv';
                  link.click();
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mr-1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {viewMode === "table" ? (
              <div className="relative">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="border-b border-border/50">
                  <TableHead className="w-[100px] bg-background"></TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">Title</TableHead>
                  <TableHead className="w-[90px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">Type</TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">Display</TableHead>
                  <TableHead className="w-[150px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">Publisher</TableHead>
                  <TableHead className="w-[70px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">DDS</TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">DDS - Discover Domain Score - domain visibility metric in Google Discover</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">Entities</TableHead>
                  <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">Category</TableHead>
                  <TableHead className="w-[80px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">Lifetime</TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">Number of hours the article has been observed in Google Discover</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="w-[90px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">Avg Pos</TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">Average position of the article in the feed</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-background">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">Est Traffic</TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-sm">Estimated traffic volume from Google Discover</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleMaterials.map((material) => (
                  <TableRow
                    key={material.id}
                    onClick={() => handleRowClick(material.id)}
                    className="cursor-pointer border-b border-border/30 transition-colors hover:bg-muted/50"
                  >
                    <TableCell>
                      <img
                        src={material.image}
                        alt={material.title}
                        className="w-20 h-14 object-cover rounded-lg shadow-sm"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1.5">
                        <div className="flex-1">
                          <div 
                            className="font-medium text-sm hover:text-primary hover:underline cursor-pointer transition-colors"
                            onClick={() => navigate(`/article/${material.id}`)}
                          >
                            {material.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {material.publishedDate}
                          </div>
                        </div>
                        <div className="flex gap-0.5 mt-0.5">
                          {material.badges.includes('reappeared') && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100">
                                    <Repeat className="w-3 h-3 text-blue-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs font-medium">Material reappeared in Discover</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {material.badges.includes('wide_geo') && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs font-medium">Material has wide GEO coverage</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {material.badges.includes('trending') && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100">
                                    <Flame className="w-3 h-3 text-red-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs font-medium">Material is gaining popularity</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {material.badges.includes('new') && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-100">
                                    <Sparkles className="w-3 h-3 text-yellow-600" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs font-medium">New material</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs bg-secondary text-foreground border-0">
                        {material.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        {material.displayFormats.map((format: string, idx: number) => (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger>
                                {format === 'title-only' && (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/>
                                    <rect x="4" y="10" width="12" height="2" rx="1" fill="currentColor"/>
                                  </svg>
                                )}
                                {format === 'title-image' && (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <rect x="3" y="6" width="12" height="2" rx="1" fill="currentColor"/>
                                    <rect x="3" y="10" width="10" height="2" rx="1" fill="currentColor"/>
                                    <rect x="16" y="6" width="5" height="6" rx="1" fill="currentColor" opacity="0.5"/>
                                  </svg>
                                )}
                                {format === 'image-top' && (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <rect x="4" y="4" width="16" height="8" rx="1" fill="currentColor" opacity="0.5"/>
                                    <rect x="4" y="14" width="12" height="2" rx="1" fill="currentColor"/>
                                    <rect x="4" y="18" width="10" height="2" rx="1" fill="currentColor"/>
                                  </svg>
                                )}
                                {format === 'story' && (
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground hover:text-foreground transition-colors">
                                    <rect x="8" y="3" width="8" height="18" rx="1" fill="currentColor" opacity="0.5"/>
                                    <circle cx="12" cy="8" r="2" fill="white"/>
                                  </svg>
                                )}
                              </TooltipTrigger>
                              <TooltipContent>
                                {format === 'title-only' && 'Title only'}
                                {format === 'title-image' && 'Title + image on right'}
                                {format === 'image-top' && 'Large image on top'}
                                {format === 'story' && 'Story'}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="flex items-center gap-1.5 cursor-pointer rounded-md px-2 py-1 transition-colors hover:bg-muted/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/publisher/${encodeURIComponent(material.domain)}`);
                        }}
                      >
                        <img
                          src={material.favicon}
                          alt=""
                          className="w-3.5 h-3.5"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <span className="text-xs font-medium">{material.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-0">
                        {material.dds}
                      </Badge>
                    </TableCell>
                    <TableCell>{renderEntitiesBadges(material)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                        {material.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{material.lifetime}</TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-foreground">
                        {material.avgPosition}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-foreground">
                        {material.estTraffic}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            ) : (
              <div className="space-y-4">
                {visibleMaterials.map(material => (
                  <div
                    key={material.id}
                    onClick={() => handleRowClick(material.id)}
                    className="cursor-pointer rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40"
                  >
                    {(() => {
                      const summaryOpen = !!cardsSummary[material.id];
                      return (
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
                      <div className="space-y-3">{renderPreviewCard(material)}</div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-lg font-semibold text-foreground line-clamp-2 hover:text-primary">
                                {material.title}
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                {material.displayFormats.map(renderFormatIcon)}
                              </div>
                            </div>
                            <button
                              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardsSummary(prev => ({
                                  ...prev,
                                  [material.id]: !summaryOpen,
                                }));
                              }}
                            >
                              Summary
                              <ChevronDown
                                className={`w-4 h-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                            <div className="text-sm text-muted-foreground">
                              {summaryOpen
                                ? "Full summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam."
                                : "Snippet summary preview..."}
                            </div>
                            <div className="mt-3 inline-flex items-center gap-2">
                              <div 
                                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/70"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/publisher/${encodeURIComponent(material.domain)}`);
                                }}
                              >
                                <img
                                  src={material.favicon}
                                  alt=""
                                  className="w-3.5 h-3.5"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                                {material.domain}
                              </div>
                              <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0">
                                DDS {material.dds}
                              </Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              {renderEntitiesBadges(material)}
                            </div>
                            <div className="mt-2">
                              <Badge
                                variant="outline"
                                className="mt-1 inline-flex text-xs border-border/50 text-muted-foreground hover:bg-primary/10 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/category/${encodeURIComponent(material.category)}`);
                                }}
                              >
                                {material.category}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 min-w-[240px]">
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                {
                                  key: "traffic",
                                  value: material.estTraffic,
                                  label: material.badges.includes("new") ? "Potential Traffic" : "Traffic",
                                  tooltip: "Estimated traffic volume from Google Discover",
                                },
                                {
                                  key: "avgPos",
                                  value: material.avgPosition,
                                  label: "Avg Position",
                                  tooltip: "Average feed position of the article",
                                },
                                {
                                  key: "lifetime",
                                  value: material.badges.includes("new") ? "New" : material.lifetime,
                                  label: material.badges.includes("new") ? "Status" : "Lifetime",
                                  tooltip: material.badges.includes("new")
                                    ? "Freshly appeared in Discover"
                                    : "Total hours observed in Discover",
                                },
                              ].map(metric => (
                                <TooltipProvider delayDuration={100} key={metric.key}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="rounded-lg border border-border/60 bg-background/80 p-2 text-center">
                                        <p className="text-base font-semibold text-foreground">{metric.value}</p>
                                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                          {metric.label}
                                        </p>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>{metric.tooltip}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground justify-end">
                              {[{ label: "First seen", value: material.publishedDate }, { label: "Last seen", value: material.publishedDate }].map(item => (
                                <TooltipProvider delayDuration={100} key={item.label}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="cursor-help underline decoration-dotted decoration-muted-foreground/60">
                                        {item.value}
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent>{item.label}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Search History - Full width */}
        <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">History Searches</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Query</TableHead>
                    <TableHead className="w-[200px] text-xs font-semibold text-muted-foreground uppercase tracking-wide">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchHistory.map((item, idx) => (
                    <TableRow key={idx} className="hover:bg-primary/5 transition-colors cursor-pointer">
                      <TableCell className="font-medium text-sm">{item.query}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
        </Card>
      </div>

      {/* Tracking Dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Tracking</DialogTitle>
            <DialogDescription>
              Configure tracking parameters for: <span className="font-semibold">{trackingItem?.value}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">Project</Label>
              <Select defaultValue="main">
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main Project</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                  <SelectItem value="competitors">Competitors</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="frequency">Check Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTrackingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // TODO: Implement tracking logic
              setTrackingDialogOpen(false);
            }}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filter Publications</DialogTitle>
            <DialogDescription>
              Configure filter parameters for the Popular publications table
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="filter-type">Type</Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="filter-type">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Video">Video</SelectItem>
                    <SelectItem value="Carousel">Carousel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filter-display">Display Format</Label>
                <Select value={filterDisplayFormat} onValueChange={setFilterDisplayFormat}>
                  <SelectTrigger id="filter-display">
                    <SelectValue placeholder="All formats" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All formats</SelectItem>
                    <SelectItem value="title-only">Title only</SelectItem>
                    <SelectItem value="title-image">Title + image</SelectItem>
                    <SelectItem value="image-top">Large image</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="filter-publisher">Publisher</Label>
              <Select value={filterPublisher} onValueChange={setFilterPublisher}>
                <SelectTrigger id="filter-publisher">
                  <SelectValue placeholder="All publishers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All publishers</SelectItem>
                  <SelectItem value="forbes.com">forbes.com</SelectItem>
                  <SelectItem value="nytimes.com">nytimes.com</SelectItem>
                  <SelectItem value="bbc.com">bbc.com</SelectItem>
                  <SelectItem value="cnn.com">cnn.com</SelectItem>
                  <SelectItem value="theguardian.com">theguardian.com</SelectItem>
                  <SelectItem value="reuters.com">reuters.com</SelectItem>
                  <SelectItem value="bloomberg.com">bloomberg.com</SelectItem>
                  <SelectItem value="wired.com">wired.com</SelectItem>
                  <SelectItem value="techcrunch.com">techcrunch.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>DDS (from)</Label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Min"
                  value={filterDDSMin}
                  onChange={(e) => setFilterDDSMin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>DDS (to)</Label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Max"
                  value={filterDDSMax}
                  onChange={(e) => setFilterDDSMax(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="filter-entity">Entity (search)</Label>
              <input
                id="filter-entity"
                type="text"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Enter entity name"
                value={filterEntity}
                onChange={(e) => setFilterEntity(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="filter-category">Category</Label>
              <Select value={filterCategoryAdv} onValueChange={setFilterCategoryAdv}>
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Lifetime (from, hours)</Label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Min"
                  value={filterLifetimeMin}
                  onChange={(e) => setFilterLifetimeMin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Lifetime (to, hours)</Label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Max"
                  value={filterLifetimeMax}
                  onChange={(e) => setFilterLifetimeMax(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Avg Pos (from)</Label>
                <input
                  type="number"
                  step="0.1"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Min"
                  value={filterAvgPosMin}
                  onChange={(e) => setFilterAvgPosMin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Avg Pos (to)</Label>
                <input
                  type="number"
                  step="0.1"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Max"
                  value={filterAvgPosMax}
                  onChange={(e) => setFilterAvgPosMax(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Est Traffic (from, K)</Label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Min"
                  value={filterTrafficMin}
                  onChange={(e) => setFilterTrafficMin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Est Traffic (to, K)</Label>
                <input
                  type="number"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder="Max"
                  value={filterTrafficMax}
                  onChange={(e) => setFilterTrafficMax(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Badges</Label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={filterBadges.includes('reappeared')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterBadges([...filterBadges, 'reappeared']);
                      } else {
                        setFilterBadges(filterBadges.filter(b => b !== 'reappeared'));
                      }
                    }}
                  />
                  <span className="text-sm">Reappeared</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={filterBadges.includes('wide_geo')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterBadges([...filterBadges, 'wide_geo']);
                      } else {
                        setFilterBadges(filterBadges.filter(b => b !== 'wide_geo'));
                      }
                    }}
                  />
                  <span className="text-sm">Wide GEO coverage</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    checked={filterBadges.includes('trending')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterBadges([...filterBadges, 'trending']);
                      } else {
                        setFilterBadges(filterBadges.filter(b => b !== 'trending'));
                      }
                    }}
                  />
                  <span className="text-sm">Gaining popularity</span>
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              // Reset all filters
              setFilterType("");
              setFilterDisplayFormat("");
              setFilterPublisher("");
              setFilterDDSMin("");
              setFilterDDSMax("");
              setFilterEntity("");
              setFilterCategoryAdv("");
              setFilterLifetimeMin("");
              setFilterLifetimeMax("");
              setFilterAvgPosMin("");
              setFilterAvgPosMax("");
              setFilterTrafficMin("");
              setFilterTrafficMax("");
              setFilterBadges([]);
            }}>
              Reset
            </Button>
            <Button onClick={() => setFilterDialogOpen(false)}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
