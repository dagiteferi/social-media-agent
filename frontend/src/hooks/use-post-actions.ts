"use client"

import { useState, useCallback } from "react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UsePostActionsOptions {
  onSuccess?: () => void
}

export function usePostActions({ onSuccess }: UsePostActionsOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const approvePost = useCallback(
    async (postId: string) => {
      setIsLoading(true)
      try {
        await api.approvePost(postId)
        toast({
          title: "Post approved",
          description: "The post has been approved successfully",
        })
        onSuccess?.()
      } catch (error) {
        toast({
          title: "Failed to approve post",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast, onSuccess],
  )

  const schedulePost = useCallback(
    async (postId: string, scheduledFor: string) => {
      setIsLoading(true)
      try {
        await api.schedulePost(postId, scheduledFor)
        toast({
          title: "Post scheduled",
          description: "The post has been scheduled successfully",
        })
        onSuccess?.()
      } catch (error) {
        toast({
          title: "Failed to schedule post",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast, onSuccess],
  )

  const deletePost = useCallback(
    async (postId: string) => {
      setIsLoading(true)
      try {
        await api.deletePost(postId)
        toast({
          title: "Post deleted",
          description: "The post has been deleted successfully",
        })
        onSuccess?.()
      } catch (error) {
        toast({
          title: "Failed to delete post",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast, onSuccess],
  )

  return {
    approvePost,
    schedulePost,
    deletePost,
    isLoading,
  }
}
