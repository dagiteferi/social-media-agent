const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const buildUrl = (path: string) => {
  // Remove trailing slash from base and leading slash from path, then join
  const baseUrl = API_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${cleanPath}`;
}

export const api = {
  get: async <T>(path:string): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(buildUrl(path));
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
      const response = await fetch(buildUrl(path), {
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
