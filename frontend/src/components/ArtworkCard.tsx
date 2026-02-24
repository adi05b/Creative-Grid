import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { Artwork } from '../types/artwork';
import './ArtworkCard.scss';
import artsyLogo from '../assets/react.svg'; // Update with correct path to Artsy logo
import CategoriesModal from './CategoryModal';

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  // State to control modal visibility
  const [showModal, setShowModal] = useState(false);
  
  // Updated logic for detecting missing images
  // Only check for explicit "missing_image.png" strings and null/undefined
  const hasMissingImage = !artwork.thumbnail || 
    (typeof artwork.thumbnail === 'string' && 
     artwork.thumbnail.includes('missing_image.png'));
  
  // Also check for image in the general 'image' property if thumbnail is missing
  const imageUrl = hasMissingImage 
    ? (artwork.image || artsyLogo) 
    : artwork.thumbnail;
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Image failed to load: ${imageUrl}`);
    e.currentTarget.src = artsyLogo;
  };

  // Handle modal open/close
  const handleOpenModal = () => {
    console.log('Opening categories modal for artwork:', artwork.id);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    console.log('Closing categories modal');
    setShowModal(false);
  };

  return (
    <>
      <Card className="artwork-card">
        <Card.Img 
          variant="top" 
          src={imageUrl} 
          alt={artwork.title} 
          onError={handleImageError}
        />
        <Card.Body>
          <Card.Title>{artwork.title}</Card.Title>
          <Card.Text>{artwork.date}</Card.Text>
        </Card.Body>
        <Card.Footer>
          <button 
            className="view-categories-btn"
            onClick={handleOpenModal}
          >
            Categories
          </button>
        </Card.Footer>
      </Card>

      {/* Categories modal */}
      <CategoriesModal 
        show={showModal} 
        onHide={handleCloseModal} 
        artwork={artwork} 
      />
    </>
  );
};

export default ArtworkCard;