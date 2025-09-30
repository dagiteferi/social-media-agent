export interface Post {
  id: string; // UUID from backend
  content: string;
  approved: boolean;
  scheduled_at: string | null; // ISO date string or null
  is_posted: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  agent_id: number | null; // Optional agent ID
}

// You can add other types here as needed, e.g.:
// export interface SocialMediaAgent {
//   id: number;
//   name: string;
//   description?: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface AnalyticsData {
//   post_id: string;
//   likes: number;
//   retweets: number;
// }
