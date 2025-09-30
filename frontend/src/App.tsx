import { Routes, Route, BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";

export default function App() {
  return (
    <BrowserRouter> {/* Wrap Routes with BrowserRouter */}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* Add other routes as needed */}
      </Routes>
    </BrowserRouter>
  );
}