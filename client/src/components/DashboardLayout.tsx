import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { BarChart3, Search, Wrench, User, ChevronDown, ChevronRight, Compass, Tag, Grid, Globe, FolderOpen, Folder, Filter as FilterIcon, Calendar, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { APP_TITLE, APP_WORDMARK } from "@/const";

interface DashboardLayoutProps {
  children: ReactNode;
  showStickyFilters?: boolean;
  filterCountry?: string;
  setFilterCountry?: (value: string) => void;
  filterLanguage?: string;
  setFilterLanguage?: (value: string) => void;
  filterCategory?: string;
  setFilterCategory?: (value: string) => void;
  filterFormat?: string;
  setFilterFormat?: (value: string) => void;
  filterPublisher?: string;
  setFilterPublisher?: (value: string) => void;
  period?: string;
  setPeriod?: (value: string) => void;
  publisherOptions?: string[];
}

const menuItems = [
  { 
    path: "/", 
    label: "Discover Analysis", 
    icon: BarChart3,
    submenu: [
      { path: "/", label: "Explorer", icon: Compass },
      { path: "/entities", label: "Entities", icon: Tag },
      { path: "/categories", label: "Categories", icon: Grid },
      { path: "/publishers", label: "Publishers", icon: Globe },
    ]
  },
  { 
    path: "/tracking", 
    label: "Discover Tracking", 
    icon: Search,
    submenu: [
      { path: "/tracking/projects", label: "My Projects", icon: FolderOpen },
      { path: "/tracking/project/1", label: "Tech News Monitoring", icon: Folder },
      { path: "/tracking/project/2", label: "Finance Tracker", icon: Folder },
      { path: "/tracking/project/3", label: "Health & Wellness", icon: Folder },
    ]
  },
  { path: "/tools", label: "Tools", icon: Wrench },
];

export default function DashboardLayout({ 
  children, 
  showStickyFilters = false,
  filterCountry = "usa",
  setFilterCountry,
  filterLanguage = "all",
  setFilterLanguage,
  filterCategory = "all",
  setFilterCategory,
  filterFormat = "all",
  setFilterFormat,
  filterPublisher = "all",
  setFilterPublisher,
  period = "live",
  setPeriod,
  publisherOptions
}: DashboardLayoutProps) {
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['/']);
  const { theme, toggleTheme } = useTheme();

  const isDefaultStickyPage = location === "/" || location === "/entities";
  const shouldRenderStickyFilters = isDefaultStickyPage || showStickyFilters;
  const stickyFiltersVisible = isDefaultStickyPage || showStickyFilters;
  const normalizedPublisherOptions = useMemo(() => {
    if (publisherOptions && publisherOptions.length > 0) {
      return publisherOptions.filter((option) => option !== "all");
    }
    return ["google", "mozilla"];
  }, [publisherOptions]);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Semrush style: light gray background */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <span className="text-2xl font-black uppercase tracking-[0.35em] text-foreground">
            {APP_WORDMARK}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.path);
            const isActive = item.submenu 
              ? item.submenu.some(sub => sub.path === location)
              : location === item.path;
            
            return (
              <div key={item.path} className="mb-1">
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.path)}
                      className={`
                        w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
                        ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-secondary"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const isSubActive = location === subItem.path;
                          return (
                            <Link key={subItem.path} href={subItem.path}>
                              <a
                                className={`
                                  flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 rounded-lg
                                  ${
                                    isSubActive
                                      ? "bg-sidebar-accent/50 text-sidebar-accent-foreground font-medium"
                                      : "text-sidebar-foreground/80 hover:bg-secondary"
                                  }
                                `}
                              >
                                <SubIcon className="w-4 h-4" />
                                {subItem.label}
                              </a>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={item.path}>
                    <a
                      className={`
                        flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg
                        ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-secondary"
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </a>
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info at Bottom */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-sidebar-foreground truncate">Иван Петров</div>
              <div className="text-xs text-muted-foreground truncate">ivan.petrov@example.com</div>
            </div>
          </div>
          
          {/* Theme Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('Toggle theme clicked, current theme:', theme);
              toggleTheme?.();
            }}
            className="w-full justify-start gap-2"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                <span>Dark Mode</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header with Filters - overlay to avoid layout shift */}
        {shouldRenderStickyFilters && (
          <div className="sticky top-0 z-50 h-0 pointer-events-none">
            <div
              className={cn(
                "border-b border-border bg-background shadow-sm transition-all duration-300",
                "h-16 px-6 flex items-center gap-3 translate-y-2 opacity-0 pointer-events-none",
                stickyFiltersVisible && "translate-y-0 opacity-100 pointer-events-auto"
              )}
            >
              <span className="text-sm font-medium text-muted-foreground mr-2">Filters:</span>
              
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="h-8 text-xs w-[100px]">
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
                <SelectTrigger className="h-8 text-xs w-[120px]">
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
                <SelectTrigger className="h-8 text-xs w-[130px]">
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
                <SelectTrigger className="h-8 text-xs w-[110px]">
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

              {typeof setFilterPublisher === "function" && (
                <Select value={filterPublisher} onValueChange={setFilterPublisher}>
                  <SelectTrigger className="h-8 text-xs w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All publishers</SelectItem>
                    {normalizedPublisherOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="h-8 text-xs w-[120px]">
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
              
              <Button size="sm" className="h-8 text-xs bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-6 ml-2">
                Search
              </Button>
            </div>
          </div>
        )}

        {/* Page Content - Full height without header */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
