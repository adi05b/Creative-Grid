export interface User {
  id: string;
  fullname: string;
  email: string;
  profileImageUrl: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Favorite {
  _id?: string;
  artistId: string;
  userId?: string;
  artistData: {
    name: string;
    image: string;
    nationality?: string;
    birthday?: string;
    deathday?: string;
  };
  createdAt: string;
}