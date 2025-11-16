import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function Publishers() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - will be replaced with real API data
  const publishers = [
    { domain: "nytimes.com", publications: 2834, trend: "+18%", favicon: "https://www.nytimes.com/vi-assets/static-assets/favicon-4bf96cb6a1093748bf5b3c429accb9b4.ico" },
    { domain: "bbc.com", publications: 2456, trend: "+15%", favicon: "https://static.files.bbci.co.uk/core/website/assets/static/icons/favicon.ico" },
    { domain: "cnn.com", publications: 2198, trend: "+12%", favicon: "https://www.cnn.com/favicon.ico" },
    { domain: "theguardian.com", publications: 1987, trend: "+14%", favicon: "https://assets.guim.co.uk/images/favicons/fee5e2d638d1c35f6d501fa397e53329/152x152.png" },
    { domain: "reuters.com", publications: 1765, trend: "+10%", favicon: "https://www.reuters.com/pf/resources/images/reuters/favicon.ico" },
    { domain: "washingtonpost.com", publications: 1543, trend: "+16%", favicon: "https://www.washingtonpost.com/favicon.ico" },
    { domain: "forbes.com", publications: 1432, trend: "+13%", favicon: "https://www.forbes.com/favicon.ico" },
    { domain: "bloomberg.com", publications: 1298, trend: "+11%", favicon: "https://www.bloomberg.com/favicon.ico" },
    { domain: "techcrunch.com", publications: 1176, trend: "+19%", favicon: "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png" },
    { domain: "theverge.com", publications: 1054, trend: "+17%", favicon: "https://www.theverge.com/icons/icon-96x96.png" },
  ];

  const filteredPublishers = publishers.filter(publisher =>
    publisher.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Publishers</h1>
          <p className="text-muted-foreground mt-2">
            Browse all publishers tracked in Google Discover
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search publishers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Publishers ({filteredPublishers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPublishers.map((publisher) => (
                <div
                  key={publisher.domain}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/publisher/${encodeURIComponent(publisher.domain)}`)}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={publisher.favicon}
                      alt=""
                      className="w-5 h-5 mt-0.5"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{publisher.domain}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {publisher.publications} publications
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-green-100 text-green-700"
                    >
                      {publisher.trend}
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
