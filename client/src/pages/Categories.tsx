import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function Categories() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real API data
  const categories = [
    { name: "Technology", publications: 1947, trend: "+18%" },
    { name: "Finance", publications: 1923, trend: "+12%" },
    { name: "Health", publications: 1654, trend: "+9%" },
    { name: "Business", publications: 1432, trend: "+15%" },
    { name: "Science", publications: 987, trend: "+6%" },
    { name: "Sports", publications: 876, trend: "+11%" },
    { name: "Entertainment", publications: 765, trend: "+7%" },
    { name: "Politics", publications: 654, trend: "+4%" },
    { name: "Travel", publications: 543, trend: "+13%" },
    { name: "Food", publications: 432, trend: "+10%" },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground mt-2">
            Browse all content categories in Google Discover
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.name}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {category.publications} publications
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {category.trend}
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
