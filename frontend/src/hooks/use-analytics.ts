import useSWR from "swr"
import { api } from "@/lib/api"

export function useAnalytics() {
  const { data, error, isLoading, mutate } = useSWR("/analytics", () => api.getAnalytics(), {
    revalidateOnFocus: false,
    refreshInterval: 30000, // Refresh every 30 seconds
  })

  return {
    analytics: data,
    isLoading,
    isError: error,
    mutate,
  }
}
