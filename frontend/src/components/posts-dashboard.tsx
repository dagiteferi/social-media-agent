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
import { PostCard } from "@/components/PostCard"; // Corrected import path
import { GeneratePostModal } from "@/components/generate-post-modal"; // Corrected import path
import { EmptyState } from "@/components/ui/empty-state"; // Corrected import path
import { useToast } from "@/hooks/use-toast"; // Use useToast hook
import type { Post } from "@/lib/types"; // Import Post type

// Mock data - replace with actual API calls
const mockPosts: Post[] = [
  {
    id: "1",
    content: " Exciting news! Our new product line is now available. Check out our latest collection with exclusive designs that you'll love. Limited stock available! Visit our website today. #NewArrivals #Shopping",
    platform: "facebook", // Added platform
    status: "approved", // Added status
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "2",
    content: " Flash Sale Alert! Get 30% off on all items this weekend only. Don't miss out on these incredible deals. Shop now and save big! #FlashSale #Deals",
    platform: "instagram", // Added platform
    status: "draft", // Added status
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    content: "Looking for the perfect gift? Our curated gift guide has something for everyone. From tech gadgets to fashion accessories, we've got you covered. #GiftIdeas #Shopping",
    platform: "twitter", // Added platform
    status: "scheduled", // Added status
    scheduled_at: new Date(Date.now() + 86400000).toISOString(), // Added scheduled_at
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function PostsDashboard() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast(); // Initialize useToast

  const handleApprove = (id: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: "approved", updatedAt: new Date().toISOString() } : post
      )
    );
    toast({
      title: "Post approved successfully!",
      variant: "success",
    });
  };

  const handleSchedule = (id: string, scheduledAt?: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, status: "scheduled", scheduled_at: scheduledAt, updatedAt: new Date().toISOString() } : post
      )
    );
    toast({
      title: "Post scheduled successfully!",
      variant: "success",
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit functionality coming soon!",
      variant: "info",
    });
  };

  const handleDelete = (id: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== id));
    toast({
      title: "Post deleted successfully!",
      variant: "success",
    });
  };

  const handlePostGenerated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]); // Add new post to the list
    toast({
      title: "Post added to your dashboard!",
      variant: "success",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && post.status === "approved") ||
      (statusFilter === "unapproved" && post.status === "draft") || // Assuming unapproved means draft
      (statusFilter === "scheduled" && post.status === "scheduled");
    return matchesSearch && matchesStatus;
  });

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
