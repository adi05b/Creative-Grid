import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { Favorite } from '../types/user';
import { removeFavorite } from '../services/favoriteService';
import './FavoriteCard.scss';

interface FavoriteCardProps {
  favorite: Favorite;
  onRemove: (artistId: string) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onRemove }) => {
  const navigate = useNavigate();
  const [timeAgo, setTimeAgo] = useState<string>('');
  
  // Calculate relative time (e.g., "2 minutes ago")
  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const addedTime = new Date(favorite.createdAt);
      const diffInSeconds = Math.floor((now.getTime() - addedTime.getTime()) / 1000);
      
      let timeString = '';
      
      if (diffInSeconds < 60) {
        timeString = diffInSeconds === 1 ? '1 second ago' : `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        timeString = minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        timeString = hours === 1 ? '1 hour ago' : `${hours} hours ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        timeString = days === 1 ? '1 day ago' : `${days} days ago`;
      }
      
      setTimeAgo(timeString);
    };
    
    updateTimeAgo();
    
    // Update time every second
    const interval = setInterval(updateTimeAgo, 1000);
    
    return () => clearInterval(interval);
  }, [favorite.createdAt]);
  
  // Handle removing artist from favorites
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await removeFavorite(favorite.artistId);
      onRemove(favorite.artistId);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };
  
  // Navigate to artist details
  const handleCardClick = () => {
    navigate(`/artist/${favorite.artistId}`);
  };
  
  // Default image if artist has no image
  const imageUrl = favorite.artistData?.image || '/assets/artsy-logo.png';
  
  return (
    <div className="favorite-card" onClick={handleCardClick}>
      <div className="favorite-card-content">
        <div 
          className="favorite-card-bg" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        ></div>
        <div className="favorite-card-info">
          <h3 className="favorite-artist-name">{favorite.artistData?.name}</h3>
          <div className="favorite-artist-details">
            {favorite.artistData?.nationality && (
              <p className="favorite-artist-nationality">
                {favorite.artistData.nationality}
              </p>
            )}
            {(favorite.artistData?.birthday || favorite.artistData?.deathday) && (
              <p className="favorite-artist-dates">
                {favorite.artistData.birthday && favorite.artistData.birthday}
                {favorite.artistData.birthday && favorite.artistData.deathday && ' – '}
                {favorite.artistData.deathday && favorite.artistData.deathday}
              </p>
            )}
          </div>
          <p className="favorite-added-time">{timeAgo}</p>
        </div>
        <Button 
          variant="danger" 
          size="sm"
          className="favorite-remove-btn"
          onClick={handleRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default FavoriteCard;