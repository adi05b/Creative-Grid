// frontend/src/services/similarArtistService.ts
import axios from 'axios';
import { Artist } from '../types/artist';

export const getSimilarArtists = async (artistId: string): Promise<Artist[]> => {
  try {
    const response = await axios.get(`/api/artists/similar/${artistId}`);
    
    if (response.data && Array.isArray(response.data)) {
      // Return similar artists, mapping to your Artist type
      return response.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching similar artists:', error);
    return [];
  }
};