import { Calendar, Check, Clock, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/types"; // Import Post type

interface PostCardProps {
  post: Post;
  onApprove: (id: string) => void;
  onSchedule: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PostCard = ({ post, onApprove, onSchedule, onEdit, onDelete }: PostCardProps) => {
  const getStatusBadge = () => {
    if (post.is_posted) {
      return <Badge className="bg-primary text-primary-foreground">Posted</Badge>;
    }
    if (post.approved) {
      return <Badge className="bg-success text-success-foreground">Approved</Badge>;
    }
    return <Badge variant="secondary">Draft</Badge>;
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      
      <div className="relative p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusBadge()}
              <span className="text-xs text-muted-foreground truncate">
                ID: {post.id.slice(0, 8)}...
              </span>
            </div>
            <p className="text-sm text-foreground line-clamp-4 leading-relaxed">
              {post.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
          </div>
          {post.updated_at !== post.created_at && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Updated {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t">
          {!post.approved && (
            <Button
              size="sm"
              onClick={() => onApprove(post.id)}
              className="flex-1 gap-2"
            >
              <Check className="h-4 w-4" />
              Approve
            </Button>
          )}
          {post.approved && !post.is_posted && (
            <Button
              size="sm"
              onClick={() => onSchedule(post.id)}
              className="flex-1 gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(post.id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(post.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
