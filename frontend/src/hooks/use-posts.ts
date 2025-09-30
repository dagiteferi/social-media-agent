import { useState, useEffect } from "react";
import type { Post } from "@/lib/types"; // Assuming Post type exists

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      // In a real app, you would fetch data here
      // For now, let's just set isLoading to false
      setIsLoading(false);
    }, 1500); // Simulate 1.5 seconds loading

    return () => clearTimeout(timer);
  }, []);

  return { posts, isLoading, error, mutate: () => {} }; // mutate is a placeholder
}
