import { Routes, Route, BrowserRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import { Layout } from "@/components/layout"; // Import Layout component
import { LoadingSplash } from "@/components/ui/loading-splash"; // Import LoadingSplash
import { usePosts } from "@/hooks/use-posts"; // Import usePosts

export default function App() {
  const { isLoading: arePostsLoading } = usePosts();

  if (arePostsLoading) {
    return <LoadingSplash />;
  }

  return (
    <BrowserRouter> {/* BrowserRouter should wrap the entire app */}
      <Layout> {/* Layout component wraps the Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Add other routes as needed */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
