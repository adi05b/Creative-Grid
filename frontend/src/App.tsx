import React from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Header1';
import Footer from './components/Footer';
import SearchPage from './pages/SearchPage1';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Create a PrivateRoute component with proper type definition
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="d-flex justify-content-center align-items-center" 
        style={{ height: 'calc(100vh - 120px)' }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Authentication check
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app-container d-flex flex-column min-vh-100">
            <Header />
            <main className="content flex-grow-1">
              <Routes>
                {/* Default route to Search page */}
                <Route path="/" element={<SearchPage />} />
                
                {/* Redirect /search to / */}
                <Route path="/search" element={<Navigate to="/" replace />} />
                
                {/* Login and Register routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected Favorites route */}
                <Route 
                  path="/favorites" 
                  element={
                    <PrivateRoute>
                      <FavoritesPage />
                    </PrivateRoute>
                  } 
                />
                
                {/* Catch-all route redirects to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;