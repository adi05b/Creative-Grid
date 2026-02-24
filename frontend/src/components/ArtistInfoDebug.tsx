// src/components/ArtistInfoDebug.tsx
import React from 'react';
import { Artist } from '../types/artist';

interface ArtistInfoDebugProps {
  artist: Artist;
}

const ArtistInfoDebug: React.FC<ArtistInfoDebugProps> = ({ artist }) => {
  // This component is only for debugging, don't use in production
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa', 
      padding: '10px', 
      marginTop: '20px',
      border: '1px solid #dee2e6',
      borderRadius: '0.25rem'
    }}>
      <h5>Artist Data Debug</h5>
      <pre style={{ fontSize: '12px' }}>
        {JSON.stringify({
          id: artist.id,
          name: artist.name,
          nationality: artist.nationality,
          birthday: artist.birthday,
          deathday: artist.deathday,
          biography: artist.biography ? artist.biography.substring(0, 50) + '...' : 'Missing',
          image: artist.image,
          thumbnail: artist.thumbnail
        }, null, 2)}
      </pre>
      
      <h6>Property Check:</h6>
      <ul style={{ fontSize: '12px' }}>
        <li>name: {artist.name ? '✓' : '❌'}</li>
        <li>nationality: {artist.nationality ? '✓' : '❌'}</li>
        <li>birthday: {artist.birthday ? '✓' : '❌'}</li>
        <li>deathday: {artist.deathday ? '✓' : '❌'}</li>
        <li>biography: {artist.biography ? '✓' : '❌'}</li>
      </ul>
    </div>
  );
};

export default ArtistInfoDebug;