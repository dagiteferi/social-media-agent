import { Routes, Route } from "react-router-dom"
import { PostsDashboard } from "@/components/posts-dashboard" // Correct import path
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { Layout } from "@/components/Layout";
import { LoadingSplash } from "@/components/ui/loading-splash"
import { usePosts } from "@/hooks/use-posts"

export default function App() {
  const { isLoading: arePostsLoading } = usePosts();

  if (arePostsLoading) {
    return <LoadingSplash />;
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