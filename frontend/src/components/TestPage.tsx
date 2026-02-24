import React, { useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
import CategoriesModal from './CategoryModal';

// Test implementation
const TestPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Sample artwork with a valid ID
  const testArtwork = {
    id: '515b0f9338ad2d78ca000554', // Replace with an actual artwork ID from your API
    title: 'The Japanese Footbridge',
    date: '1899',
    thumbnail: 'https://d32dm0rphc51dk.cloudfront.net/dTGcd0jIR_dVfxWpYO8zzw/square.jpg'
  };
  
  return (
    <Container className="py-5">
      <h1>Modal Test Page</h1>
      <p>This page tests the CategoriesModal component</p>
      
      <Row className="mb-5">
        <Col md={4}>
          <Card>
            <Card.Img 
              variant="top" 
              src={testArtwork.thumbnail} 
              alt={testArtwork.title} 
            />
            <Card.Body>
              <Card.Title>{testArtwork.title}</Card.Title>
              <Card.Text>{testArtwork.date}</Card.Text>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
              >
                View Categories
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <div className="debug-info p-3 bg-light mb-4">
        <h3>Debug Information</h3>
        <p><strong>Modal State:</strong> {showModal ? 'OPEN' : 'CLOSED'}</p>
        <p><strong>Test Artwork ID:</strong> {testArtwork.id}</p>
        <div>
          <Button 
            variant="outline-primary" 
            onClick={() => {
              console.log('Forcing modal open...');
              setShowModal(true);
            }}
            className="me-2"
          >
            Force Open Modal
          </Button>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              console.log('Forcing modal close...');
              setShowModal(false);
            }}
          >
            Force Close Modal
          </Button>
        </div>
      </div>
      
      {/* The modal component */}
      <CategoriesModal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        artwork={testArtwork} 
      />
    </Container>
  );
};

export default TestPage;