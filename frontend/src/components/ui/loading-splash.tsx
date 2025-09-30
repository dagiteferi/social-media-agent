import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming Skeleton component exists

export function LoadingSplash() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 p-4">
      <div className="w-full max-w-7xl space-y-6">
        {/* Header Skeleton */}
        <Skeleton className="h-16 w-full" />

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Post Card Skeletons */}
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
