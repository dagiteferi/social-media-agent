import useSWR from "swr"
import { api } from "@/lib/api"
import type { PostStatus } from "@/lib/types"

interface UsePostsOptions {
  status?: PostStatus
  platform?: string
  sortBy?: string
}

export function usePosts(options?: UsePostsOptions) {
  const { data, error, isLoading, mutate } = useSWR(["/posts", options], () => api.getPosts(options), {
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  })

  return {
    posts: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function usePost(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/posts/${id}` : null, () => (id ? api.getPost(id) : null), {
    revalidateOnFocus: false,
  })

  return {
    post: data,
    isLoading,
    isError: error,
    mutate,
  }
}
