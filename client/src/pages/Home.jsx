import { Link } from 'react-router-dom';
import { FaSearch, FaBriefcase, FaUserTie, FaBuilding, FaRocket } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Dream Job or Hire the Perfect Candidate
            </h1>
            <p className="hero-subtitle">
              Connect with thousands of opportunities and talented professionals worldwide.
              Start your journey today!
            </p>
            <div className="hero-buttons">
              <Link to="/jobs" className="btn btn-primary">
                <FaSearch className="btn-icon" />
                Browse Jobs
              </Link>
              <Link to="/register" className="btn btn-secondary">
                <FaRocket className="btn-icon" />
                Get Started
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-illustration">
              <FaBriefcase className="hero-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose JobPortal?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaSearch />
              </div>
              <h3>Smart Job Search</h3>
              <p>Advanced filters and AI-powered recommendations to find the perfect job match.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaUserTie />
              </div>
              <h3>Professional Profiles</h3>
              <p>Create detailed profiles showcasing your skills, experience, and achievements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBuilding />
              </div>
              <h3>Company Insights</h3>
              <p>Get detailed information about companies and their work culture.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FaBriefcase />
              </div>
              <h3>Easy Application</h3>
              <p>One-click applications with resume upload and tracking system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Career Journey?</h2>
            <p>Join thousands of professionals who have found their dream jobs through JobPortal.</p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Create Account
              </Link>
              <Link to="/jobs" className="btn btn-outline">
                Explore Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-item">
              <h3>5,000+</h3>
              <p>Companies</p>
            </div>
            <div className="stat-item">
              <h3>50,000+</h3>
              <p>Job Seekers</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 