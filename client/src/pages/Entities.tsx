import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function Entities() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real API data
  const entities = [
    { name: "Artificial Intelligence", publications: 1247, trend: "+15%" },
    { name: "Climate Change", publications: 982, trend: "+8%" },
    { name: "Electric Vehicles", publications: 876, trend: "+22%" },
    { name: "Cryptocurrency", publications: 734, trend: "-5%" },
    { name: "Space Exploration", publications: 623, trend: "+12%" },
    { name: "Renewable Energy", publications: 589, trend: "+18%" },
    { name: "Quantum Computing", publications: 456, trend: "+25%" },
    { name: "Metaverse", publications: 398, trend: "-3%" },
    { name: "Gene Therapy", publications: 367, trend: "+14%" },
    { name: "5G Technology", publications: 334, trend: "+9%" },
  ];

  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Entities</h1>
          <p className="text-muted-foreground mt-2">
            Browse all popular entities tracked in Google Discover
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Entities ({filteredEntities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntities.map((entity) => (
                <div
                  key={entity.name}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/entity/${encodeURIComponent(entity.name)}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{entity.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {entity.publications} publications
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        entity.trend.startsWith('+')
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {entity.trend}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
