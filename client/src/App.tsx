import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import DiscoverTracking from "./pages/DiscoverTracking";
import Tools from "./pages/Tools";
import EntityDetail from "./pages/EntityDetail";
import CategoryDetail from "./pages/CategoryDetail";
import PublisherDetail from "./pages/PublisherDetail";
import ArticleDetail from "./pages/ArticleDetail";
import Entities from "./pages/Entities";
import Categories from "./pages/Categories";
import Publishers from "./pages/Publishers";
import MyProjects from "./pages/MyProjects";
import LanguageDetail from "./pages/LanguageDetail";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/tracking" component={DiscoverTracking} />
      <Route path="/tools" component={Tools} />
      <Route path="/entity/:name" component={EntityDetail} />
      <Route path="/category/:name" component={CategoryDetail} />
      <Route path="/publisher/:domain" component={PublisherDetail} />
      <Route path="/article/:id" component={ArticleDetail} />
      <Route path="/language/:code" component={LanguageDetail} />
      <Route path="/entities" component={Entities} />
      <Route path="/categories" component={Categories} />
      <Route path="/publishers" component={Publishers} />
      <Route path="/tracking/projects" component={MyProjects} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
