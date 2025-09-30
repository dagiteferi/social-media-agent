import type { Post, GeneratePostRequest, AnalyticsData, PostStatus } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message)
    this.name = "APIError"
  }
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An error occurred" }))
    throw new APIError(error.message || "API request failed", response.status, error)
  }

  return response.json()
}

export const api = {
  // Generate a new post
  generatePost: async (data: GeneratePostRequest): Promise<Post> => {
    return fetchAPI<Post>("/generate", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get all posts with optional filters
  getPosts: async (filters?: {
    status?: PostStatus
    platform?: string
    sortBy?: string
  }): Promise<Post[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.platform) params.append("platform", filters.platform)
    if (filters?.sortBy) params.append("sort_by", filters.sortBy)

    const query = params.toString()
    return fetchAPI<Post[]>(`/posts${query ? `?${query}` : ""}`)
  },

  // Get a single post
  getPost: async (id: string): Promise<Post> => {
    return fetchAPI<Post>(`/posts/${id}`)
  },

  // Approve a post
  approvePost: async (id: string): Promise<Post> => {
    return fetchAPI<Post>(`/posts/${id}/approve`, {
      method: "POST",
    })
  },

  // Schedule a post
  schedulePost: async (id: string, scheduledFor: string): Promise<Post> => {
    return fetchAPI<Post>(`/posts/${id}/schedule`, {
      method: "POST",
      body: JSON.stringify({ scheduled_for: scheduledFor }),
    })
  },

  // Delete a post
  deletePost: async (id: string): Promise<void> => {
    return fetchAPI<void>(`/posts/${id}`, {
      method: "DELETE",
    })
  },

  // Get analytics
  getAnalytics: async (): Promise<AnalyticsData> => {
    return fetchAPI<AnalyticsData>("/analytics")
  },
}
