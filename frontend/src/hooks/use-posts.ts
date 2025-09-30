import { useState, useEffect, useCallback } from "react";
import type { Post } from "@/lib/types";
import { api } from "@/lib/api";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await api.get<Post[]>("/api/v1/content/posts");
    if (data) {
      setPosts(data);
    } else {
      setError(fetchError || "Failed to fetch posts");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, isLoading, error, mutate: fetchPosts };
}
