import { useState, useRef, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout, deleteAccount } from '../services/authService';
import './Header.scss';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    // Handle ESC key to close dropdown
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      authLogout();
      // Add notification for successful logout
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      authLogout();
      // Add notification for successful account deletion
    } catch (error) {
      console.error('Delete account error:', error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <Navbar className="custom-navbar">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/" className="navbar-title">
          Artist Search
        </Navbar.Brand>
        
        <Nav className="ms-auto align-items-center">
          <div className="nav-buttons">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
            >
              Search
            </Nav.Link>
            
            {isAuthenticated ? (
              // Authenticated user navigation
              <>
                <Nav.Link 
                  as={Link} 
                  to="/favorites" 
                  className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}
                >
                  Favorites
                </Nav.Link>
                
                <div className="profile-dropdown-container" ref={dropdownRef}>
                  <div className="profile-dropdown-toggle" onClick={toggleDropdown}>
                    <img 
                      src={user?.profileImageUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'} 
                      alt="Profile" 
                      className="profile-image" 
                    />
                    <span className="profile-name">{user?.fullname || 'User'}</span>
                    <i className={`dropdown-caret ${showDropdown ? 'open' : ''}`}></i>
                  </div>
                  
                  {showDropdown && (
                    <div className="profile-dropdown-menu">
                      <div className="dropdown-item text-danger" onClick={handleDeleteAccount}>
                        Delete account
                      </div>
                      <div className="dropdown-item" onClick={handleLogout}>
                        Log out
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Unauthenticated user navigation
              <>
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className={`nav-item ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  Log In
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/register" 
                  className={`nav-item ${location.pathname === '/register' ? 'active' : ''}`}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </div>
        </Nav>
      </div>
    </Navbar>
  );
};

export default Header;