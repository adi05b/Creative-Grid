import React, { useEffect, useState } from 'react';
import { Artist } from '../types/artist';
import { useAuth } from '../context/AuthContext';
import { checkFavorite } from '../services/favoriteService';
import FavoriteButton from './FavoriteButton';
import './ArtistInfo.scss';

interface ArtistInfoProps {
  artist: Artist;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ artist }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState<boolean>(true);
  
  // Check if this artist is in favorites when component mounts
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isAuthenticated && artist.id) {
        try {
          setIsCheckingFavorite(true);
          const result = await checkFavorite(artist.id);
          setIsFavorite(result);
        } catch (error) {
          console.error('Error checking favorite status:', error);
          setIsFavorite(false);
        } finally {
          setIsCheckingFavorite(false);
        }
      } else {
        setIsCheckingFavorite(false);
        setIsFavorite(false);
      }
    };

    fetchFavoriteStatus();
  }, [artist.id, isAuthenticated]);
  
  // Format birth and death dates with an en dash
  const formatDates = () => {
    if (artist.birthday && artist.deathday) {
      return `${artist.birthday} – ${artist.deathday}`; // Using en-dash
    } else if (artist.birthday) {
      return artist.birthday;
    } else if (artist.deathday) {
      return `d. ${artist.deathday}`;
    }
    return '';
  };

  // Parse biography paragraphs
  const renderBiography = () => {
    if (!artist.biography) return null;
    
    // Split by double newlines for paragraphs
    const paragraphs = artist.biography.split('\n\n');
    
    // If no double newlines, try single newlines
    if (paragraphs.length === 1 && artist.biography.includes('\n')) {
      return artist.biography.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ));
    }
    
    return paragraphs.map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  return (
    <div className="artist-info">
      <div className="artist-header">
        <h2 className="artist-name">{artist.name}</h2>
        
        {isAuthenticated && !isCheckingFavorite && (
          <FavoriteButton
            artistId={artist.id}
            artistData={{
              name: artist.name,
              image: artist.thumbnail || '',
              nationality: artist.nationality,
              birth: artist.birthday,
              death: artist.deathday
            }}
            initialIsFavorite={isFavorite}
            onToggle={(newState: boolean) => setIsFavorite(newState)}
            className="artist-info-favorite"
          />
        )}
      </div>
      
      <p className="artist-meta">
        {artist.nationality && <span>{artist.nationality}</span>}
        {artist.nationality && formatDates() && <span>, </span>}
        <span>{formatDates()}</span>
      </p>
      
      {artist.biography && (
        <div className="artist-biography">
          {renderBiography()}
        </div>
      )}
    </div>
  );
};

export default ArtistInfo;