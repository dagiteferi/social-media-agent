export type PostStatus = "draft" | "approved" | "scheduled" | "published"
export type Platform = "facebook" | "instagram" | "twitter" | "linkedin"

export interface Post {
  id: string
  content: string
  platform: Platform
  status: PostStatus
  productContext?: string
  targetAudience?: string
  tone?: string
  scheduled_at?: string // Renamed from scheduledFor
  createdAt: string
  updatedAt: string
  imageUrl?: string
}

export interface GeneratePostRequest {
  productContext: string
  targetAudience: string
  tone: string
  platform: Platform
}

export interface AnalyticsData {
  totalPosts: number
  approvedPosts: number
  scheduledPosts: number
  draftPosts: number
  approvalRate: number
  schedulingRate: number
  postsOverTime: Array<{
    date: string
    count: number
  }>
  postsByPlatform: Array<{
    platform: Platform
    count: number
  }>
}