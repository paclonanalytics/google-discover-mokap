import { useRoute } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function CategoryDetail() {
  const [, params] = useRoute("/category/:name");
  const [, navigate] = useLocation();
  const categoryName = params?.name ? decodeURIComponent(params.name) : "";
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
          <h1 className="text-3xl font-bold">Category: {categoryName}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Name</h3>
                <p className="text-lg">{categoryName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Statistics</h3>
                <p className="text-sm text-muted-foreground">
                  Detailed statistics and analytics for category "{categoryName}" will be available after backend integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
