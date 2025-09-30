import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreatePost: () => void;
}

export const EmptyState = ({ onCreatePost }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <FileText className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">No posts yet</h3>
      <p className="mb-6 max-w-md text-muted-foreground">
        Start by generating your first AI-powered social media post. It only takes a few seconds!
      </p>
      <Button onClick={onCreatePost} size="lg" className="gap-2">
        <Plus className="h-5 w-5" />
        Generate New Post
      </Button>
    </div>
  );
};
