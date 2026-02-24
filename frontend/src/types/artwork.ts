// frontend/src/types/artwork.ts
export interface Artwork {
  id: string;
  title: string;
  date?: string;
  thumbnail?: string;
  categories?: string[];
  image?: string
}

export interface Category {
  id: string;
  name: string;
  thumbnail?: string;
}