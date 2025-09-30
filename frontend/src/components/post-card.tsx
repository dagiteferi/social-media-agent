"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Check, Clock, MoreVertical, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { usePostActions } from "@/hooks/use-post-actions"
import { formatDate, formatDateTime, getMinDateTime } from "@/lib/utils/date"
import { STATUS_CONFIG, PLATFORM_CONFIG } from "@/lib/constants"
import type { Post } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: Post
  onUpdate?: () => void
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")

  const { approvePost, schedulePost, deletePost, isLoading } = usePostActions({
    onSuccess: onUpdate,
  })

  const handleApprove = useCallback(async () => {
    await approvePost(post.id)
  }, [approvePost, post.id])

  const handleSchedule = useCallback(async () => {
    if (!scheduledDate) return

    await schedulePost(post.id, scheduledDate)
    setShowScheduleDialog(false)
    setScheduledDate("")
  }, [schedulePost, post.id, scheduledDate])

  const handleDelete = useCallback(async () => {
    await deletePost(post.id)
    setShowDeleteDialog(false)
  }, [deletePost, post.id])

  const statusConfig = STATUS_CONFIG[post.status]
  const platformConfig = PLATFORM_CONFIG[post.platform]
  const canApprove = post.status === "draft"
  const canSchedule = post.status === "draft" || post.status === "approved"

  return (
    <>
      <Card className="group hover:border-muted-foreground/30 transition-all duration-200">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
          <div className="space-y-2">
            <Badge variant={statusConfig.variant} className={cn("font-medium", statusConfig.className)}>
              {statusConfig.label}
            </Badge>
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", platformConfig.bgColor, platformConfig.borderColor)} />
              <span className={cn("text-sm font-medium", platformConfig.color)}>{platformConfig.label}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isLoading}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canApprove && (
                <DropdownMenuItem onClick={handleApprove} disabled={isLoading}>
                  <Check className="mr-2 h-4 w-4" />
                  Approve Post
                </DropdownMenuItem>
              )}
              {canSchedule && (
                <DropdownMenuItem onClick={() => setShowScheduleDialog(true)} disabled={isLoading}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Post
                </DropdownMenuItem>
              )}
              {(canApprove || canSchedule) && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/90 leading-relaxed line-clamp-4 text-pretty">{post.content}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          {post.scheduledFor && (
            <div className="flex items-center gap-1.5 text-blue-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDateTime(post.scheduledFor)}</span>
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Post</DialogTitle>
            <DialogDescription>
              Choose when you want this post to be published on {platformConfig.label}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">Date and Time</Label>
              <Input
                id="schedule-date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={getMinDateTime()}
              />
              <p className="text-xs text-muted-foreground">Select a future date and time for publishing</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} disabled={isLoading || !scheduledDate}>
              {isLoading ? "Scheduling..." : "Schedule Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
