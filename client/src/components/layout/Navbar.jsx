import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaBriefcase, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isJobSeeker, isEmployer } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <FaBriefcase className="brand-icon" />
          <span>JobPortal</span>
        </Link>

        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </Link>
          <Link to="/jobs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
            Jobs
          </Link>
          
          {isAuthenticated ? (
            <>
              {isJobSeeker && (
                <Link to="/my-applications" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  My Applications
                </Link>
              )}
              {isEmployer && (
                <>
                  <Link to="/post-job" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    Post Job
                  </Link>
                  <Link to="/my-jobs" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                    My Jobs
                  </Link>
                </>
              )}
              <Link to="/dashboard" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                <FaUser className="nav-icon" />
                Profile
              </Link>
              <button className="nav-link logout-btn" onClick={handleLogout}>
                <FaSignOutAlt className="nav-icon" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-link register-btn" onClick={() => setIsMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <div className="navbar-toggle" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 