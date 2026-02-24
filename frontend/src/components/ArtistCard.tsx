import React from 'react';
import { Card } from 'react-bootstrap';
import { Artist } from '../types/artist';
import { useAuth } from '../context/AuthContext';
import './ArtistCard.scss';
import artsyLogo from '../assets/react.svg'; // Update with correct path to Artsy logo

interface ArtistCardProps {
  artist: Artist;
  isSelected: boolean;
  onClick?: (artist: Artist) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (artist: Artist, isFavorite: boolean) => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ 
  artist, 
  isSelected, 
  onClick, 
  isFavorite = false,
  onToggleFavorite 
}) => {
  const { isAuthenticated } = useAuth();
  
  // Check if image URL is missing or contains the default Artsy missing image path
  const hasMissingImage = !artist.thumbnail || 
    artist.thumbnail.includes('missing_image.png') || 
    artist.thumbnail.includes('missing-image');
    
  // Use Artsy logo for missing images
  const imageUrl = hasMissingImage ? artsyLogo : artist.thumbnail;
    
  const handleClick = () => {
    onClick?.(artist);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the card click from triggering
    if (onToggleFavorite) {
      onToggleFavorite(artist, !isFavorite);
    }
  };
  
  return (
    <Card
      className={`artist-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      <div className="card-img-container">
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={artist.name}
          className="artist-image"
        />
        {isAuthenticated && (
          <button 
            className={`favorite-button ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite ? '⭐' : '☆'}
          </button>
        )}
      </div>
      <Card.Body className={isSelected ? 'selected' : ''}>
        <Card.Title>{artist.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default ArtistCard;