export interface Review {
  id: number;
  author: string;
  location: string;
  spotId: string;
  image: string;
  content: string;
  likes: number;
  category: "reviews" | "tips";
  avatar: string;
  isLiked?: boolean;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Mei-Ling",
    location: "Haeundae Beach",
    spotId: "haeundae-beach",
    image: "/images/spots/haeundae.png",
    content:
      "The sunset here is absolutely magical. Just like in the dramas! Make sure to visit around 5 PM for the best lighting. 🌅",
    likes: 124,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mei",
  },
  {
    id: 2,
    author: "Seung-jin",
    location: "Gamcheon Culture Village",
    spotId: "gamcheon-village",
    image: "/images/posters/gamcheon.jpg",
    content:
      "Don't miss the Little Prince statue! The view of the colorful houses is even better in person. Best photo spot in Busan! 📸",
    likes: 89,
    category: "tips",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seung",
  },
  {
    id: 3,
    author: "Yuki",
    location: "Gwangalli Beach",
    spotId: "gwangalli-beach",
    image: "/images/spots/gwangalli.png",
    content:
      "The night view of the bridge is stunning! A perfect place for a romantic walk after dinner. 🌃",
    likes: 210,
    category: "reviews",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
  },
];
