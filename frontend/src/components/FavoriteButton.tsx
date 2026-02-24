import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { toggleFavorite, checkFavorite } from '../services/favoriteService';
import './FavoriteButton.scss';

interface FavoriteButtonProps {
  artistId: string;
  artistData: {
    name: string;
    image: string;
    nationality?: string;
    birth?: string;
    death?: string;
  };
  initialIsFavorite?: boolean; // Optional prop with a default value
  onToggle?: (isFavorite: boolean) => void;
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  artistId,
  artistData,
  initialIsFavorite = false, // Default to false if not provided
  onToggle,
  className = ''
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(initialIsFavorite);
  const [isToggling, setIsToggling] = useState<boolean>(false);
  
  // If not initially set, it will check the favorite status
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (isAuthenticated && !initialIsFavorite) {
        try {
          const status = await checkFavorite(artistId);
          setIsFavorite(status);
        } catch (error) {
          console.error('Error checking favorite status:', error);
        }
      }
    };

    checkFavoriteStatus();
  }, [artistId, isAuthenticated, initialIsFavorite]);

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    if (isToggling) return;

    setIsToggling(true);

    try {
      // Toggle favorite status
      await toggleFavorite(artistId, artistData, !isFavorite);
      
      // Update local state
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);
      
      // Call callback if provided
      if (onToggle) {
        onToggle(newFavoriteStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      variant="link"
      className={`favorite-button ${className}`}
      onClick={handleToggle}
      disabled={isToggling}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isFavorite ? "yellow" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="star-icon"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </Button>
  );
};

export default FavoriteButton;