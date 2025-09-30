"use client"

import { useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Sparkles } from "lucide-react"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { validatePostGeneration } from "@/lib/utils/validation"
import { PLATFORM_OPTIONS, TONE_OPTIONS } from "@/lib/constants"
import type { Platform } from "@/lib/types"

interface GeneratePostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const INITIAL_STATE = {
  productContext: "",
  targetAudience: "",
  tone: "professional",
  platform: "instagram" as Platform,
}

export function GeneratePostModal({ open, onOpenChange, onSuccess }: GeneratePostModalProps) {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const resetForm = useCallback(() => {
    setFormData(INITIAL_STATE)
  }, [])

  const handleGenerate = useCallback(async () => {
    const validation = validatePostGeneration(formData)

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors[0],
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      await api.generatePost({
        productContext: formData.productContext,
        targetAudience: formData.targetAudience,
        tone: formData.tone,
        platform: formData.platform,
      })

      toast({
        title: "Post generated successfully",
        description: "Your AI-generated post is ready for review",
      })

      resetForm()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [formData, toast, resetForm, onOpenChange, onSuccess])

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (!newOpen && !isGenerating) {
        resetForm()
      }
      onOpenChange(newOpen)
    },
    [isGenerating, resetForm, onOpenChange],
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Generate AI Post
          </DialogTitle>
          <DialogDescription className="text-pretty">
            Provide details about your product and audience to generate an engaging social media post
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform">
              Platform <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.platform}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, platform: value as Platform }))}
            >
              <SelectTrigger id="platform">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORM_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-context">
              Product Context <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="product-context"
              placeholder="Describe your product, its features, and key selling points..."
              value={formData.productContext}
              onChange={(e) => setFormData((prev) => ({ ...prev, productContext: e.target.value }))}
              rows={4}
              className="resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">{formData.productContext.length} characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-audience">
              Target Audience <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="target-audience"
              placeholder="Who is your target audience? Include demographics, interests, pain points..."
              value={formData.targetAudience}
              onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
              rows={3}
              className="resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">{formData.targetAudience.length} characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={formData.tone} onValueChange={(value) => setFormData((prev) => ({ ...prev, tone: value }))}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Post
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
