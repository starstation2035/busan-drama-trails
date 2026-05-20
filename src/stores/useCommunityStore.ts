import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MOCK_REVIEWS, type Review, type Comment } from "@/data/mockReviews";

interface CommunityState {
  posts: Review[];
  addPost: (post: Omit<Review, "id" | "likes">) => void;
  toggleLike: (postId: number) => void;
  addComment: (postId: number, comment: Omit<Comment, "id" | "createdAt">) => void;
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
              comments: [],
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
                  likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                }
              : p,
          ),
        })),
      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [
                    ...(p.comments || []),
                    {
                      ...comment,
                      id: Date.now(),
                      createdAt: new Date().toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }),
                    },
                  ],
                }
              : p,
          ),
        })),
    }),
    {
      name: "community-storage",
    },
  ),
);
