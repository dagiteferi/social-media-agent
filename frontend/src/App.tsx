import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import { Layout } from "@/components/layout"; // Import Layout
import { LoadingSplash } from "@/components/ui/loading-splash"; // Import LoadingSplash
import { usePosts } from "@/hooks/use-posts"; // Import usePosts

export default function App() {
  const { isLoading: arePostsLoading } = usePosts(); // Assuming usePosts exists and provides isLoading

  if (arePostsLoading) {
    return <LoadingSplash />; // Show splash screen while posts are loading
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* Add other routes as needed */}
      </Routes>
    </Layout>
  );
}
