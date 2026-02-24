import React, { useState, useEffect } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import { getArtistArtworks } from '../services/artistService';
import { Artwork } from '../types/artwork';
import ArtworkCard from './ArtworkCard';
import './ArtistArtworks.scss';

interface ArtistArtworksProps {
  artistId: string;
}

const ArtistArtworks: React.FC<ArtistArtworksProps> = ({ artistId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (artistId && artistId !== 'undefined') {
      console.log("Fetching artworks for artist ID:", artistId);
      fetchArtworks();
    } else {
      console.error("Invalid artist ID in ArtistArtworks:", artistId);
      setError("Invalid artist ID");
      setLoading(false);
    }
  }, [artistId]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getArtistArtworks(artistId);
      setArtworks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      setError("Failed to load artworks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading artworks...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="info" className="m-3">
        {error}
      </Alert>
    );
  }

  if (!Array.isArray(artworks) || artworks.length === 0) {
    return (
      <Alert variant="info" className="m-3">
        No artworks.
      </Alert>
    );
  }

  return (
    <div className="artist-artworks">
      <div className="artwork-container">
        <div className="artwork-grid">
          {artworks.map(artwork => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistArtworks;