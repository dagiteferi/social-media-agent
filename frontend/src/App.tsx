import { Routes, Route } from "react-router-dom"
import { PostsDashboard } from "@/components/posts-dashboard"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Layout } from "@/components/layout"
import { LoadingSplash } from "@/components/ui/loading-splash" // Import LoadingSplash
import { usePosts } from "@/hooks/use-posts" // Import usePosts hook

export default function App() {
  const { isLoading: arePostsLoading } = usePosts(); // Get loading state from usePosts

  if (arePostsLoading) {
    return <LoadingSplash />; // Show splash screen while posts are loading
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PostsDashboard />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
      </Routes>
    </Layout>
  )
}
