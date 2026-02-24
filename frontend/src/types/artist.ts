// frontend/src/types/artist.ts
// types/artist.ts
// frontend/src/types/artist.ts
export interface Artist {
  id: string;
  name: string;
  birthday?: string;
  deathday?: string;
  nationality?: string;
  biography?: string;
  thumbnail?: string;
  image?: string;
}

// Additional interfaces for other artist-related data
export interface ArtistDetails {
  id: string;
  name: string;
  birthday: string;
  deathday: string;
  nationality: string;
  biography: string;
  thumbnail?: string;
  image?: string;
}
