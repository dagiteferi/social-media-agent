import type { Platform } from "./types"

export const PLATFORM_CONFIG = {
  facebook: {
    label: "Facebook",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/20",
  },
  instagram: {
    label: "Instagram",
    color: "text-pink-600",
    bgColor: "bg-pink-600/10",
    borderColor: "border-pink-600/20",
  },
  twitter: {
    label: "Twitter",
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
  },
  linkedin: {
    label: "LinkedIn",
    color: "text-blue-700",
    bgColor: "bg-blue-700/10",
    borderColor: "border-blue-700/20",
  },
} as const

export const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    variant: "secondary" as const,
    className: "bg-muted text-muted-foreground border-muted-foreground/20",
  },
  approved: {
    label: "Approved",
    variant: "outline" as const,
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  },
  scheduled: {
    label: "Scheduled",
    variant: "outline" as const,
    className: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  },
  published: {
    label: "Published",
    variant: "outline" as const,
    className: "bg-violet-500/10 text-violet-600 border-violet-500/30",
  },
} as const

export const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "enthusiastic", label: "Enthusiastic" },
  { value: "informative", label: "Informative" },
  { value: "humorous", label: "Humorous" },
] as const

export const PLATFORM_OPTIONS: Array<{ value: Platform; label: string }> = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
] as const

export const SORT_OPTIONS = [
  { value: "created_at", label: "Newest First" },
  { value: "-created_at", label: "Oldest First" },
  { value: "status", label: "By Status" },
  { value: "platform", label: "By Platform" },
] as const
