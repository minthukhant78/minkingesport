export interface Review {
  id?: string;
  author: string;
  authorId: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  date: string;
  content: string;
  url?: string;
}

export interface Game {
  id:string;
  slug: string;
  title: string;
  description: string;
  category: 'PC' | 'Mobile';
  tags: string[];
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  developer: string;
  releaseDate: string;
  websiteUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  media: ({ type: 'image'; url: string } | { type: 'youtube'; videoId: string })[];
  reviews: Review[];
  news?: NewsUpdate[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'admin' | 'user';
  photoURL?: string;
  favoriteGenre?: string;
  bio?: string;
  socialLink?: string;
  reviewsCount?: number;
}

export interface VideoHighlight {
  id: string;
  videoId: string;
  title: string;
  description: string;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  order: number;
}

export interface UserData extends UserProfile {
    uid: string;
}

export interface Creator {
  id: string;
  name: string;
  title: string;
  quote: string;
  avatarUrl: string;
  facebookUrl?: string;
  xUrl?: string;
  tiktokUrl?: string;
  order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}
