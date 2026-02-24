import React, { useState, useEffect } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../services/favoriteService';
import FavoriteCard from '../components/FavoriteCard';
import { useAuth } from '../context/AuthContext';
import { Favorite } from '../types/user';
import './FavoritesPage.scss';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Flag to track if this is a full page reload
  const [isFullPageReload, setIsFullPageReload] = useState(true);

  useEffect(() => {
    // Set up a listener for page reload
    const handlePageReload = () => {
      setIsFullPageReload(true);
    };

    window.addEventListener('beforeunload', handlePageReload);

    return () => {
      window.removeEventListener('beforeunload', handlePageReload);
    };
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      // Only load from server on full page reload
      if (isAuthenticated && isFullPageReload) {
        try {
          setIsLoading(true);
          const favoritesData = await getFavorites();
          // Ensure favoritesData is an array
          const validFavorites = Array.isArray(favoritesData) ? favoritesData : [];
          setFavorites(validFavorites);
        } catch (error) {
          console.error('Error loading favorites', error);
          setFavorites([]);
        } finally {
          setIsLoading(false);
          setIsFullPageReload(false);
        }
      } else {
        // Ensure loading is set to false for subsequent navigations
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, isFullPageReload]);

  const handleRemoveFavorite = async (artistId: string) => {
    try {
      await removeFavorite(artistId);
      setFavorites(prev => {
        // Ensure prev is an array before filtering
        return Array.isArray(prev) 
          ? prev.filter(fav => fav.artistId !== artistId) 
          : [];
      });
    } catch (error) {
      console.error('Error removing favorite', error);
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Add null check before accessing length
  const favoritesExist = Array.isArray(favorites) && favorites.length > 0;

  return (
    <Container fluid className="favorites-page px-4 py-3">
      {isLoading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : !favoritesExist ? (
        <Alert variant="info" className="mt-3">
          No favorite artists.
        </Alert>
      ) : (
        <div className="favorites-grid">
          {favorites.map((favorite) => (
            <FavoriteCard 
              key={favorite.artistId || Math.random().toString()} 
              favorite={favorite} 
              onRemove={() => handleRemoveFavorite(favorite.artistId)}
            />
          ))}
        </div>
      )}
    </Container>
  );
};

export default FavoritesPage;