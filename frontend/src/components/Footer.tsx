import React from 'react';
import './Footer.scss';
import artsyLogo from '../assets/react.svg'; // Make sure you have this file in your assets folder

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <a href="https://www.artsy.net/" target="_blank" rel="noopener noreferrer">
        Powered by 
        <img 
          src={artsyLogo}  
          alt="Artsy Logo"
          className="artsy-logo"
        />
        Artsy.
      </a>
    </footer>
  );
};

export default Footer;