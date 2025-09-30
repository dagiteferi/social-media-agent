import { Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import { AppSidebar } from "@/components/app-sidebar"
import { PostsDashboard } from "@/components/posts-dashboard"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden dark">
      <aside className="w-64 flex-shrink-0 border-r border-border">
        <AppSidebar />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<PostsDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
