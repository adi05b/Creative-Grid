// frontend/src/services/artistService.ts
import api from './api';
import { Artist } from '../types/artist';
import { Artwork } from '../types/artwork';
import { Category } from '../types/artwork';

// Types for the responses
export interface ArtistSearchResult {
  id: string;
  name: string;
  thumbnail: string;
  nationality?: string;
  birthday?: string;
}

/**
 * Search for artists by name
 * @param query - Search query
 * @returns Promise with search results
 */
export const searchArtists = async (query: string): Promise<ArtistSearchResult[]> => {
  try {
    if (!query || query.trim() === '') {
      console.error('Empty search query');
      return [];
    }
    
    console.log('Searching for artists with query:', query);
    const response: ArtistSearchResult[] = await api.get('/artists/search', {
      params: { q: query.trim() }
    });
    
    return response || [];
  } catch (error) {
    console.error('Error searching artists:', error);
    return [];
  }
};

/**
 * Get artist details by ID
 * @param artistId - Artist ID
 * @returns Promise with artist details
 */
export const getArtistDetails = async (artistId: string): Promise<Artist> => {
  try {
    if (!artistId) {
      console.error('Invalid artist ID for getArtistDetails:', artistId);
      throw new Error('Invalid artist ID');
    }
    
    console.log('Fetching details for artist ID:', artistId);
    const response: Artist = await api.get(`/artists/details/${artistId}`);
    
    // Ensure proper mapping between backend and frontend models
    // This is a safeguard in case the backend response structure changes
    return {
      id: response.id,
      name: response.name,
      birthday: response.birthday,
      deathday: response.deathday,
      nationality: response.nationality,
      biography: response.biography,
      image: response.image,
      thumbnail: response.thumbnail
    };
  } catch (error) {
    console.error('Error getting artist details:', error);
    throw error;
  }
};

/**
 * Get artist artworks by artist ID
 * @param artistId - Artist ID
 * @returns Promise with artist artworks
 */
export const getArtistArtworks = async (artistId: string): Promise<Artwork[]> => {
  try {
    if (!artistId) {
      console.error('Invalid artist ID for getArtistArtworks:', artistId);
      return [];
    }
    
    console.log('Fetching artworks for artist ID:', artistId);
    const response: Artwork[] = await api.get(`/artists/artworks/${artistId}`);
    
    return response || [];
  } catch (error) {
    console.error('Error getting artist artworks:', error);
    return [];
  }
};

/**
 * Get artwork categories (genes) by artwork ID
 * @param artworkId - Artwork ID
 * @returns Promise with artwork categories
 */
export const getArtworkCategories = async (artworkId: string): Promise<Category[]> => {
  try {
    if (!artworkId) {
      console.error('Invalid artwork ID for getArtworkCategories:', artworkId);
      return [];
    }
    
    console.log('Fetching categories for artwork ID:', artworkId);
    const response: Category[] = await api.get(`/artists/categories/${artworkId}`);
    
    return response || [];
  } catch (error) {
    console.error('Error getting artwork categories:', error);
    return [];
  }
};

/**
 * Get similar artists for an artist
 * @param artistId - Artist ID
 * @returns Promise with similar artists
 */
export const getSimilarArtists = async (artistId: string): Promise<ArtistSearchResult[]> => {
  try {
    if (!artistId) {
      console.error('Invalid artist ID for getSimilarArtists:', artistId);
      return [];
    }
    
    console.log('Fetching similar artists for ID:', artistId);
    const response: ArtistSearchResult[] = await api.get(`/artists/similar/${artistId}`);
    
    return response || [];
  } catch (error) {
    console.error('Error getting similar artists:', error);
    return [];
  }
};

/**
 * Check if an artist exists
 * @param artistId - Artist ID
 * @returns Promise with boolean indicating if artist exists
 */
export const checkArtistExists = async (artistId: string): Promise<boolean> => {
  try {
    if (!artistId) {
      console.error('Invalid artist ID for checkArtistExists:', artistId);
      return false;
    }
    
    await getArtistDetails(artistId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return false;
    }
    console.error('Error checking if artist exists:', error);
    return false;
  }
};

export default {
  searchArtists,
  getArtistDetails,
  getSimilarArtists,
  getArtistArtworks,
  getArtworkCategories,
  checkArtistExists
};