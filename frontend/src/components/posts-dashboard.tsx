"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Filter } from "lucide-react"
import { PostCard } from "./post-card"
import { GeneratePostModal } from "./generate-post-modal"
import { EmptyState } from "./ui/empty-state"
import { LoadingSpinner } from "./ui/loading-spinner"
import { usePosts } from "@/hooks/use-posts"
import { PLATFORM_OPTIONS, SORT_OPTIONS } from "@/lib/constants"
import type { PostStatus, Platform } from "@/lib/types"

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "scheduled", label: "Scheduled" },
  { value: "published", label: "Published" },
] as const

export function PostsDashboard() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState<PostStatus | "all">("all")
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all")
  const [sortBy, setSortBy] = useState("created_at")

  const { posts, isLoading, mutate } = usePosts({
    status: statusFilter === "all" ? undefined : statusFilter,
    platform: platformFilter === "all" ? undefined : platformFilter,
    sortBy,
  })

  const hasActiveFilters = useMemo(
    () => statusFilter !== "all" || platformFilter !== "all" || sortBy !== "created_at",
    [statusFilter, platformFilter, sortBy],
  )

  const handleOpenModal = () => setShowGenerateModal(true)
  const handleSuccess = () => mutate()

  if (isLoading) {
    return <LoadingSpinner />
  }

  const hasNoPosts = !posts || posts.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Posts</h1>
          <p className="text-muted-foreground text-pretty">Manage your AI-generated social media content</p>
        </div>
        <Button onClick={handleOpenModal} size="lg" className="sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Generate Post
        </Button>
      </div>

      {!hasNoPosts && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PostStatus | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={(value) => setPlatformFilter(value as Platform | "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                {PLATFORM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {hasNoPosts ? (
        <EmptyState
          icon={Plus}
          title={hasActiveFilters ? "No posts found" : "No posts yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your filters to see more results"
              : "Get started by generating your first AI-powered social media post"
          }
          action={
            hasActiveFilters
              ? undefined
              : {
                  label: "Generate Your First Post",
                  onClick: handleOpenModal,
                }
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={handleSuccess} />
          ))}
        </div>
      )}

      <GeneratePostModal open={showGenerateModal} onOpenChange={setShowGenerateModal} onSuccess={handleSuccess} />
    </div>
  )
}
