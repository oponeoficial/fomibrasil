export interface Review {
  id: number;
  user: string;
  userImage: string;
  rating: number;
  text: string;
  date: string;
  tags: string[];
  likes: number;
  useful: boolean;
}

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  gallery: string[];
  description: string;
  tags: { text: string; color: string }[];
  rating: number;
  reviewCount: number;
  distance: string;
  price: string;
  address: string;
  phone: string;
  website: string;
  hours: string;
  ratingsBreakdown: {
    food: number;
    service: number;
    ambiance: number;
  };
  reviews: Review[];
  features: string[];
  longDescription: string;
}

export type TabId = 'home' | 'discover' | 'newreview' | 'activity' | 'profile';