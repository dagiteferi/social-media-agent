import React from "react";
import { Header } from "@/components/Header"; // Corrected import path

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col dark">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
