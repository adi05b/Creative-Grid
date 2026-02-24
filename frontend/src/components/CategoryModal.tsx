import React, { useEffect, useState } from 'react';
import { Modal, Spinner, Row, Col, Alert } from 'react-bootstrap';
import { Artwork, Category } from '../types/artwork';
import CategoryCard from './CategoryCard';
import './CategoryModal.scss';
import artsyLogo from '../assets/react.svg'; // Update with correct path to Artsy logo

interface CategoriesModalProps {
  show: boolean;
  onHide: () => void;
  artwork: Artwork;
}

const CategoriesModal: React.FC<CategoriesModalProps> = ({ show, onHide, artwork }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!show || !artwork?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching categories for artwork ID: ${artwork.id}`);
        // Using the correct endpoint path
        const response = await fetch(`/api/artists/categories/${artwork.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories data received:', data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          console.log('No categories found in response');
          setError('No categories.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('No categories.');
      } finally {
        setLoading(false);
      }
    };

    if (show) {
      fetchCategories();
    }
  }, [show, artwork?.id]);

  // Use the artwork's thumbnail directly, with fallback to Artsy logo
  const thumbnailSrc = artwork?.thumbnail || artsyLogo;
  
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      size="lg"
      backdrop="static"
      container={document.body}
    >
      <Modal.Header closeButton>
        <div className="artwork-title-section">
          <img 
            src={thumbnailSrc} 
            alt={artwork?.title} 
            className="artwork-thumbnail"
            onError={(e) => { e.currentTarget.src = artsyLogo; }}
          />
          <div className="artwork-info">
            <h5>{artwork?.title}</h5>
            {artwork?.date && <p>{artwork.date}</p>}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="categories-content">
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Row xs={1} sm={2} md={4} className="g-4">
              {categories.map((category) => (
                <Col key={category.id}>
                  <CategoryCard category={category} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CategoriesModal;