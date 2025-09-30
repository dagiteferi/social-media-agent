import { TrendingUp, CheckCircle, Calendar, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";

const metrics = [
  {
    label: "Total Posts Generated",
    value: "127",
    change: "+12%",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
  },
  {
    label: "Posts Approved",
    value: "98",
    change: "+8%",
    trend: "up",
    icon: CheckCircle,
    color: "text-success",
  },
  {
    label: "Posts Scheduled",
    value: "76",
    change: "+15%",
    trend: "up",
    icon: Calendar,
    color: "text-primary",
  },
  {
    label: "Approval Rate",
    value: "77.2%",
    change: "+3%",
    trend: "up",
    icon: Percent,
    color: "text-success",
  },
];

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Performance</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your content generation and engagement metrics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.label} className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary ${metric.color}`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="text-sm font-medium text-success flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {metric.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-bold mt-1">{metric.value}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="p-8">
          <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Strong Approval Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Your approval rate of 77.2% is above the platform average. This indicates high-quality content generation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Consistent Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  76 posts scheduled shows strong commitment to maintaining regular content flow across your social channels.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Growing Activity</h3>
                <p className="text-sm text-muted-foreground">
                  15% increase in scheduled posts this month demonstrates improving workflow efficiency.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
