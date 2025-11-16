import { Plus, Folder } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";

export default function MyProjects() {
  const [, navigate] = useLocation();

  // Mock data - will be replaced with real API data
  const projects = [
    { id: 1, name: "Tech News Monitoring", entities: 12, categories: 3, publishers: 8, lastUpdated: "2 hours ago" },
    { id: 2, name: "Finance Tracker", entities: 8, categories: 2, publishers: 15, lastUpdated: "5 hours ago" },
    { id: 3, name: "Health & Wellness", entities: 15, categories: 4, publishers: 6, lastUpdated: "1 day ago" },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage your Discover tracking projects
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md cursor-pointer transition-shadow"
              onClick={() => navigate(`/tracking/project/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Folder className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{project.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Updated {project.lastUpdated}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {project.entities} entities
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {project.categories} categories
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {project.publishers} publishers
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
