import { useState } from "react";
import { Sparkles, RotateCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";

interface GeneratePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostGenerated: (newPost: Post) => void;
}

export const GeneratePostModal = ({ open, onOpenChange, onPostGenerated }: GeneratePostModalProps) => {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [step, setStep] = useState<"input" | "preview">("input");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await api.post<Post>("/api/v1/content/generate", { prompt });
      if (data) {
        setGeneratedContent(data.content);
        setCurrentPost(data);
        setStep("preview");
        toast.success("Post generated successfully!");
      } else {
        toast.error(error || "Failed to generate post");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to generate post");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!currentPost) return;

    setIsApproving(true);
    try {
      const { error } = await api.post(`/api/v1/content/approve/${currentPost.id}`, { approved: true });
      if (!error) {
        toast.success("Post approved and saved!");
        onPostGenerated({ ...currentPost, approved: true });
        handleClose();
      } else {
        toast.error(error || "Failed to approve post");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to approve post");
    } finally {
      setIsApproving(false);
    }
  };

  const handleGenerateAgain = () => {
    setStep("input");
    setGeneratedContent("");
    setCurrentPost(null);
  };

  const handleClose = () => {
    setPrompt("");
    setGeneratedContent("");
    setCurrentPost(null);
    setStep("input");
    onOpenChange(false);
  };

  const characterCount = generatedContent.length;
  const twitterLimit = 280;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {step === "input" ? "Generate Social Media Post" : "Review & Refine Your Post"}
          </DialogTitle>
          <DialogDescription>
            {step === "input"
              ? "Describe the post you want to generate and let AI create engaging content for you."
              : "Review the generated content and make any adjustments before approving."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {step === "input" ? (
            <>
              <Textarea
                placeholder="Describe the post you want to generate (e.g., 'Promote our new seasonal coffee blend with a call to action to visit our website')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] resize-none"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Post
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[200px] resize-none"
              />
              <div className="flex items-center justify-between text-sm">
                <span className={characterCount > twitterLimit ? "text-destructive" : "text-muted-foreground"}>
                  {characterCount} / {twitterLimit} characters
                </span>
                {characterCount > twitterLimit && (
                  <span className="text-destructive text-xs">Exceeds Twitter limit</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving || characterCount > twitterLimit}
                  className="flex-1 gap-2"
                >
                  {isApproving ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Approving...
                    </>
                  ) : (
                    "Approve & Save"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGenerateAgain}
                  className="gap-2"
                >
                  <RotateCw className="h-4 w-4" />
                  Generate Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
