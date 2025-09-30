const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export const api = {
  get: async <T>(path: string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`);
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || "An unknown error occurred" };
      }
      const data = await response.json();
      return { data };
    } catch (error: any) {
      return { error: error.message || "Network error" };
    }
  },

  post: async <T>(path: string, body: any): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { error: errorData.detail || "An unknown error occurred" };
      }
      const data = await response.json();
      return { data };
    } catch (error: any) {
      return { error: error.message || "Network error" };
    }
  },
};