import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import SearchForm from '../components/SearchForm';
import ArtistCard from '../components/ArtistCard';
import ArtistDetails from '../components/ArtistDetails';
import { Artist } from '../types/artist';
import { searchArtists, getArtistDetails } from '../services/artistService';
import './SearchPage.scss';

// Define the props with a default value
type SearchPageProps = {
  isAuthenticated?: boolean;
};

export default function SearchPage({ isAuthenticated = false }: SearchPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  async function handleSearch(query: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchArtists(query);
      // Check if response is an array directly or if it has a results property
      const results = Array.isArray(response) ? response : (response && typeof response === 'object' && 'results' in response ? (response as any).results : []);
      setArtists(results);
      
      if (results.length === 0) {
        setError('No results found.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setArtists([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleClear() {
    setArtists([]);
    setSelectedArtist(null);
    setError(null);
    setDetailsError(null);
    setShowDetails(false);
  }

  async function handleArtistSelect(artist: Artist) {
    setSelectedArtist(artist); // Set initially for immediate feedback
    setShowDetails(true);
    setIsDetailsLoading(true); // Show loading state for details
    setDetailsError(null);
    
    try {
      // Fetch detailed artist information
      console.log('Fetching details for artist:', artist.name, 'with ID:', artist.id);
      const artistDetails = await getArtistDetails(artist.id);
      console.log('Received artist details:', artistDetails);
      
      // Update with the complete details
      setSelectedArtist(artistDetails);
    } catch (err) {
      console.error('Error fetching artist details:', err);
      setDetailsError('Failed to load artist details. Please try again.');
    } finally {
      setIsDetailsLoading(false); // Hide loading state
    }
  }

  return (
    <div className="search-page">
      <SearchForm 
        onSearch={handleSearch}
        onClear={handleClear}
        isLoading={isLoading}
      />
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {artists.length > 0 && (
        <div className="search-results">
          <div className="artists-container">
            {artists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                isSelected={selectedArtist?.id === artist.id}
                onClick={handleArtistSelect}
              />
            ))}
          </div>
        </div>
      )}
      
      {showDetails && selectedArtist && (
        <ArtistDetails 
          artist={selectedArtist}
          isAuthenticated={isAuthenticated}
          isLoading={isDetailsLoading}
          error={detailsError === null ? undefined : detailsError}
        />
      )}
    </div>
  );
}