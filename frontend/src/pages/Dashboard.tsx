import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostCard } from "@/components/PostCard";
import { GeneratePostModal } from "@/components/GeneratePostModal";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { usePosts } from "@/hooks/use-posts";
import { api } from "@/lib/api";
import { Post } from "@/lib/types";

export default function Dashboard() {
  const { posts, isLoading, error, mutate } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleApprove = async (id: string) => {
    const { error } = await api.post(`/api/v1/content/approve/${id}`, { approved: true });
    if (!error) {
      toast.success("Post approved successfully!");
      mutate();
    } else {
      toast.error(error);
    }
  };

  const handleSchedule = async (id: string) => {
    const { error } = await api.post(`/api/v1/scheduling/post_now/${id}`, {});
    if (!error) {
      toast.success("Post scheduled successfully!");
      mutate();
    } else {
      toast.error(error);
    }
  };

  const handleEdit = (id: string) => {
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = (id: string) => {
    // Implement actual delete API call here if available
    toast.info("Delete functionality coming soon!");
  };

  const handlePostGenerated = (newPost: Post) => {
    mutate(); // Re-fetch posts after a new one is generated
    toast.success("Post added to your dashboard!");
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && post.approved && !post.is_posted) ||
      (statusFilter === "unapproved" && !post.approved) ||
      (statusFilter === "scheduled" && post.is_posted);
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 px-4 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Post Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, manage, and schedule your social media content
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="lg" className="gap-2 shadow-lg">
            <Plus className="h-5 w-5" />
            Generate New Post
          </Button>
        </div>

        {posts.length > 0 && (
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Posts</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="unapproved">Unapproved</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          posts.length === 0 ? (
            <EmptyState onCreatePost={() => setIsModalOpen(true)} />
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              No posts match your search criteria
            </div>
          )
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onApprove={handleApprove}
                onSchedule={handleSchedule}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <GeneratePostModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onPostGenerated={handlePostGenerated}
      />
    </div>
  );
}
