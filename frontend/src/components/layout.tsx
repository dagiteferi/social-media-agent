import { AppSidebar } from "@/components/app-sidebar";
import { Toaster } from "@/components/ui/toaster";
import React, { useState } from "react"; // Import useState
import { Button } from "@/components/ui/button"; // Import Button component
import { Menu } from "lucide-react"; // Import Menu icon

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="flex h-screen overflow-hidden dark">
      {/* Mobile Header with Hamburger Menu */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
        <h1 className="text-lg font-semibold">ESMA</h1> {/* Your app title */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0 border-r border-border bg-background transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:block`}
      >
        <AppSidebar />
        {/* Close button for mobile sidebar */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        >
          <Menu className="h-6 w-6 rotate-90" /> {/* A simple close icon */}
          <span className="sr-only">Close sidebar</span>
        </Button>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
