import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Globe, FileText } from "lucide-react";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";

export default function LanguageDetail() {
  const params = useParams();
  const [, navigate] = useLocation();
  const languageName = decodeURIComponent(params.code || "");
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{languageName}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Language analytics and insights
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Total Publications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <Badge variant="secondary" className="mt-2 bg-accent/10 text-accent border-0">
                +22% this week
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg DDS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.5</div>
              <Badge variant="secondary" className="mt-2 bg-accent/10 text-accent border-0">
                +5% this week
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-sm text-muted-foreground mt-2">
                Active regions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for future content */}
        <Card>
          <CardHeader>
            <CardTitle>Language Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Detailed analytics for {languageName} publications will be displayed here.
              This includes trending topics, top publishers, category distribution, and temporal patterns.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
