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
import { EmptyState } from "@/components/EmptyState"; // Corrected import path
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/hooks/use-posts";
import { api } from "@/lib/api";
import type { Post } from "@/lib/types";

export function PostsDashboard() {
  const { posts, isLoading, error, mutate } = usePosts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  const handleApprove = async (id: string) => {
    const { error } = await api.post(`/api/v1/content/approve/${id}`, { approved: true });
    if (!error) {
      toast({
        title: "Post approved successfully!",
        variant: "success",
      });
      mutate();
    } else {
      toast({
        title: "Failed to approve post",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleSchedule = async (id: string) => {
    const { error } = await api.post(`/api/v1/scheduling/post_now/${id}`, {});
    if (!error) {
      toast({
        title: "Post scheduled successfully!",
        variant: "success",
      });
      mutate();
    } else {
      toast({
        title: "Failed to schedule post",
        description: error,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Edit functionality coming soon!",
      variant: "info",
    });
  };

  const handleDelete = (id: string) => {
    // Implement actual delete API call here if available
    toast({
      title: "Delete functionality coming soon!",
      variant: "info",
    });
  };

  const handlePostGenerated = (newPost: Post) => {
    mutate(); // Re-fetch posts after a new one is generated
    toast({
      title: "Post added to your dashboard!",
      variant: "success",
    });
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
