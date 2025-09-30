import type { Post, GeneratePostRequest, AnalyticsData } from "./types"

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
    const errorData = await response.json().catch(() => ({}))
    throw new APIError(errorData.detail || "API request failed", response.status, errorData)
  }

  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

export const api = {
  generatePost: async (data: GeneratePostRequest): Promise<Post> => {
    const prompt = `Generate a social media post for ${data.platform}. Product context: ${data.productContext}. Target audience: ${data.targetAudience}. Tone: ${data.tone}.`
    return fetchAPI<Post>("/api/v1/content/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    })
  },

  getPosts: async (): Promise<Post[]> => {
    return fetchAPI<Post[]>("/api/v1/content/posts")
  },

  // Note: Backend endpoint for getting a single post is not yet implemented.
  getPost: async (id: string): Promise<Post> => {
    return fetchAPI<Post>(`/api/v1/content/posts/${id}`)
  },

  approvePost: async (id: string, scheduledAt?: string): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(`/api/v1/content/approve/${id}`, {
      method: "POST",
      body: JSON.stringify({ scheduled_at: scheduledAt }),
    })
  },

  // Note: Backend endpoint for deleting a post is not yet implemented.
  // deletePost: async (id: string): Promise<void> => {
  //   return fetchAPI<void>(`/api/v1/content/posts/${id}`, {
  //     method: "DELETE",
  //   })
  // },

  getAnalytics: async (): Promise<AnalyticsData> => {
    return fetchAPI<AnalyticsData>("/api/v1/analytics/metrics")
  },
}