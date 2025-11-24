import { useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function PublisherDetail() {
  const [, params] = useRoute("/publisher/:domain");
  const [, navigate] = useLocation();
  const publisherDomain = params?.domain ? decodeURIComponent(params.domain) : "";
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("/");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
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
          <h1 className="text-3xl font-bold">Publisher: {publisherDomain}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Publisher Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Domain</h3>
                <p className="text-lg">{publisherDomain}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Statistics</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed statistics and analytics for publisher "{publisherDomain}" will be available after backend integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
