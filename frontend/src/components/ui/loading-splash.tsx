import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSplash() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <h1 className="mt-4 text-2xl font-bold text-foreground">ESMA</h1>
      <p className="text-muted-foreground">Loading your social media agent...</p>
    </div>
  );
}
