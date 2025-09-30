"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { PostCard } from "./post-card"
import { GeneratePostModal } from "./generate-post-modal"
import { EmptyState } from "./ui/empty-state"
import { LoadingSpinner } from "./ui/loading-spinner"
import { usePosts } from "@/hooks/use-posts"

export function PostsDashboard() {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const { posts, isLoading, mutate } = usePosts()

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

      {hasNoPosts ? (
        <EmptyState
          icon={Plus}
          title="No posts yet"
          description="Get started by generating your first AI-powered social media post"
          action={{
            label: "Generate Your First Post",
            onClick: handleOpenModal,
          }}
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