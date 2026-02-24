import React from 'react';
import { Card } from 'react-bootstrap';
import { Category } from '../types/artwork';
import artsyLogo from '../assets/react.svg'; // Update with correct path to Artsy logo

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  // Use Artsy logo as fallback if no thumbnail is available
  const thumbnailSrc = category.thumbnail || artsyLogo;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log(`Category image failed to load: ${category.name}`);
    e.currentTarget.src = artsyLogo;
  };

  return (
    <Card className="category-card">
      <div className="category-image-container">
        <Card.Img 
          variant="top" 
          src={thumbnailSrc} 
          alt={category.name} 
          className="category-image"
          onError={handleImageError}
        />
      </div>
      <Card.Body>
        <Card.Title className="category-name">{category.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default CategoryCard;