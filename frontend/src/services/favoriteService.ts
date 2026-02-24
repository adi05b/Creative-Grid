import api from './api';
import { Favorite } from '../types/user';

export const toggleFavorite = async (
  artistId: string, 
  artistData: {
    name: string;
    image: string;
    nationality?: string;
    birth?: string;
    death?: string;
  }, 
  isFavorite: boolean
) => {
  if (isFavorite) {
    return await addFavorite(artistId, artistData);
  } else {
    return await removeFavorite(artistId);
  }
};

export const addFavorite = async (
  artistId: string, 
  artistData: {
    name: string;
    image: string;
    nationality?: string;
    birth?: string;
    death?: string;
  }
) => {
  const response = await api.post('/favorites', { 
    artistId, 
    artistData: {
      name: artistData.name,
      image: artistData.image,
      nationality: artistData.nationality,
      birthday: artistData.birth,
      deathday: artistData.death
    }
  });
  return response.data;
};

export const removeFavorite = async (artistId: string) => {
  const response = await api.delete(`/favorites/${artistId}`);
  return response.data;
};

export const getFavorites = async (): Promise<Favorite[]> => {
  try {
    const response = await api.get('/favorites');
    
    // Ensure response.data is an array
    const favorites = Array.isArray(response.data) 
      ? response.data 
      : [];

    // Validate each favorite object
    return favorites.filter(fav => 
      fav && 
      typeof fav.artistId === 'string' && 
      fav.artistData
    );
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const checkFavorite = async (artistId: string): Promise<boolean> => {
  try {
    const response = await api.get(`/favorites/check/${artistId}`);
    return response.data.isFavorite || false;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
};