import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_REVIEWS, type Review } from "@/data/mockReviews";

interface CommunityState {
  posts: Review[];
  addPost: (post: Omit<Review, "id" | "likes">) => void;
  toggleLike: (postId: number) => void;
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set) => ({
      posts: MOCK_REVIEWS,
      addPost: (post) =>
        set((state) => ({
          posts: [
            {
              ...post,
              id: Date.now(),
              likes: 0,
            },
            ...state.posts,
          ],
        })),
      toggleLike: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId 
              ? { 
                  ...p, 
                  isLiked: !p.isLiked,
                  likes: p.isLiked ? p.likes - 1 : p.likes + 1 
                } 
              : p
          ),
        })),
    }),
    {
      name: "community-storage",
    }
  )
);
