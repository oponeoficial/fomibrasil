export enum AppStep {
    WELCOME = 'WELCOME',
    LOCATION = 'LOCATION',
    PREFERENCES = 'PREFERENCES',
    FEED = 'FEED',
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN'
}

export interface UserPreferences {
    company: string[];
    mood: string | null;
    restrictions: string[];
    budget: string | null;
}

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

export type FilterCategoryType = 'who' | 'mood' | 'occasion' | 'cuisine' | 'price' | 'distance';

export interface FilterOption {
    id: string;
    label: string;
    icon?: string;
}

export interface FilterGroup {
    id: FilterCategoryType;
    label: string;
    options: FilterOption[];
}

export interface FilterChip {
    id: string;
    label: string;
    icon: string;
    category: string;
}

export type TabId = 'home' | 'discover' | 'newreview' | 'activity' | 'profile';
