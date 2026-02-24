import React, { useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import CategoriesModal from './CategoryModal';

// This is a test component to debug the CategoriesModal
const ModalDebug: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Sample artwork data for testing
  const testArtwork = {
    id: '515b0f9338ad2d78ca000554', // Use a real artwork ID that you know works with your API
    title: 'Test Artwork',
    date: '2023',
    thumbnail: 'https://d32dm0rphc51dk.cloudfront.net/dTGcd0jIR_dVfxWpYO8zzw/square.jpg'
  };

  const handleShowModal = () => {
    console.log('Opening modal...');
    setShowModal(true);
  };

  const handleHideModal = () => {
    console.log('Closing modal...');
    setShowModal(false);
  };

  return (
    <Container className="mt-5">
      <h2>Modal Debug Page</h2>
      <p>Click the button below to test the Categories Modal</p>
      
      <Button 
        variant="primary" 
        onClick={handleShowModal}
        className="mb-4"
      >
        Open Test Modal
      </Button>
      
      {/* Debug info */}
      <div className="mt-3 p-3 bg-light">
        <h5>Debug Info:</h5>
        <p>Modal state: {showModal ? 'OPEN' : 'CLOSED'}</p>
        <p>Test artwork ID: {testArtwork.id}</p>
      </div>

      {/* The modal component we're testing */}
      <CategoriesModal 
        show={showModal} 
        onHide={handleHideModal} 
        artwork={testArtwork} 
      />
    </Container>
  );
};

export default ModalDebug;