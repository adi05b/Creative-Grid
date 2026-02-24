// src/components/ArtistDetails.tsx
import React, { useState } from 'react';
import { Nav, Spinner} from 'react-bootstrap';
import { Artist } from '../types/artist';
import ArtistInfo from './ArtistInfo';
import ArtistArtworks from './ArtistArtworks';
import './ArtistDetails.scss';

interface ArtistDetailsProps {
  artist: Artist | null;
  isLoading: boolean;
  isAuthenticated?: boolean;
  error?: string;
}

const ArtistDetails: React.FC<ArtistDetailsProps> = ({ artist, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'artworks'>('info');

  if (isLoading) {
    return (
      <div className="artist-details">
        <Nav className="artist-tabs" variant="tabs">
          <Nav.Item>
            <Nav.Link active={activeTab === 'info'} disabled>
              Artist Info
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === 'artworks'} disabled>
              Artworks
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <div className="artist-details-loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="artist-details-error alert alert-danger">{error}</div>;
  }

  if (!artist) {
    return null;
  }

  return (
    <div className="artist-details">
      <Nav 
        className="artist-tabs" 
        variant="tabs"
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key as 'info' | 'artworks')}
      >
        <Nav.Item>
          <Nav.Link eventKey="info">Artist Info</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="artworks">Artworks</Nav.Link>
        </Nav.Item>
      </Nav>
      
      <div className="tab-content">
        {activeTab === 'info' && <ArtistInfo artist={artist} />}
        {activeTab === 'artworks' && <ArtistArtworks artistId={artist.id} />}
      </div>
    </div>
  );
};

export default ArtistDetails;