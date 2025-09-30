"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { FileText, CheckCircle2, Calendar, TrendingUp, AlertCircle } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import { EmptyState } from "./ui/empty-state"
import { useAnalytics } from "@/hooks/use-analytics"

const METRIC_CONFIGS = [
  {
    key: "totalPosts",
    title: "Total Posts",
    icon: FileText,
    color: "text-blue-600",
    description: "All generated posts",
  },
  {
    key: "approvedPosts",
    title: "Approved Posts",
    icon: CheckCircle2,
    color: "text-emerald-600",
    getDescription: (data: { approvalRate: number }) => `${data.approvalRate.toFixed(1)}% approval rate`,
  },
  {
    key: "scheduledPosts",
    title: "Scheduled Posts",
    icon: Calendar,
    color: "text-violet-600",
    getDescription: (data: { schedulingRate: number }) => `${data.schedulingRate.toFixed(1)}% scheduling rate`,
  },
  {
    key: "draftPosts",
    title: "Draft Posts",
    icon: AlertCircle,
    color: "text-muted-foreground",
    description: "Awaiting review",
  },
] as const

export function AnalyticsDashboard() {
  const { analytics, isLoading } = useAnalytics()

  const insights = useMemo(() => {
    if (!analytics) return []

    return [
      {
        icon: CheckCircle2,
        iconColor: "text-emerald-600",
        bgColor: "bg-emerald-600/10",
        title: "Approval Rate",
        description: `${analytics.approvalRate.toFixed(1)}% of your posts are being approved.${
          analytics.approvalRate >= 70 ? " Great job!" : " Consider refining your content strategy."
        }`,
      },
      {
        icon: Calendar,
        iconColor: "text-violet-600",
        bgColor: "bg-violet-600/10",
        title: "Scheduling Rate",
        description: `${analytics.schedulingRate.toFixed(1)}% of approved posts are scheduled.${
          analytics.schedulingRate >= 50 ? " Excellent planning!" : " Consider scheduling more posts in advance."
        }`,
      },
    ]
  }, [analytics])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!analytics) {
    return (
      <EmptyState
        icon={FileText}
        title="No analytics data available"
        description="Generate some posts to see analytics"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">Analytics</h1>
        <p className="text-muted-foreground text-pretty">Track your social media content performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRIC_CONFIGS.map((config) => {
          const Icon = config.icon
          const value = analytics[config.key as keyof typeof analytics] as number
          const description = "getDescription" in config ? config.getDescription(analytics) : config.description

          return (
            <Card key={config.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Posts Over Time</CardTitle>
            <CardDescription>Number of posts generated per day</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.postsOverTime.length > 0 ? (
              <ChartContainer
                config={{
                  count: {
                    label: "Posts",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart data={analytics.postsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    }
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posts by Platform</CardTitle>
            <CardDescription>Distribution across social media platforms</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.postsByPlatform.length > 0 ? (
              <ChartContainer
                config={{
                  count: {
                    label: "Posts",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={analytics.postsByPlatform}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="platform"
                    tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon
            return (
              <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                <div className={`rounded-full ${insight.bgColor} p-2`}>
                  <Icon className={`h-4 w-4 ${insight.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{insight.title}</p>
                  <p className="text-sm text-muted-foreground text-pretty">{insight.description}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
