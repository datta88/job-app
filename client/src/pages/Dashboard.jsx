import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaBuilding, FaUser, FaChartLine, FaBell } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isJobSeeker, isEmployer } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Here's what's happening with your account</p>
        </div>

        <div className="dashboard-content">
          {isJobSeeker ? (
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <FaBriefcase className="card-icon" />
                  <h3>My Applications</h3>
                </div>
                <div className="card-body">
                  <p>Track your job applications and their status</p>
                  <Link to="/my-applications" className="btn btn-primary">
                    View Applications
                  </Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>My Profile</h3>
                </div>
                <div className="card-body">
                  <p>Update your profile and resume</p>
                  <Link to="/profile" className="btn btn-primary">
                    Edit Profile
                  </Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <FaChartLine className="card-icon" />
                  <h3>Job Recommendations</h3>
                </div>
                <div className="card-body">
                  <p>Find jobs that match your skills</p>
                  <Link to="/jobs" className="btn btn-primary">
                    Browse Jobs
                  </Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <FaBell className="card-icon" />
                  <h3>Notifications</h3>
                </div>
                <div className="card-body">
                  <p>Stay updated with job alerts</p>
                  <button className="btn btn-secondary">
                    Manage Alerts
                  </button>
                </div>
              </div>
            </div>
          ) : isEmployer ? (
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <FaBuilding className="card-icon" />
                  <h3>My Jobs</h3>
                </div>
                <div className="card-body">
                  <p>Manage your posted job listings</p>
                  <Link to="/my-jobs" className="btn btn-primary">
                    View Jobs
                  </Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <FaBriefcase className="card-icon" />
                  <h3>Post New Job</h3>
                </div>
                <div className="card-body">
                  <p>Create a new job listing</p>
                  <Link to="/post-job" className="btn btn-primary">
                    Post Job
                  </Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>Company Profile</h3>
                </div>
                <div className="card-body">
                  <p>Update your company information</p>
                  <Link to="/profile" className="btn btn-primary">
                    Edit Profile
                  </Link>
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <FaChartLine className="card-icon" />
                  <h3>Analytics</h3>
                </div>
                <div className="card-body">
                  <p>View job performance metrics</p>
                  <button className="btn btn-secondary">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <FaUser className="card-icon" />
                  <h3>Admin Panel</h3>
                </div>
                <div className="card-body">
                  <p>Manage the job portal system</p>
                  <button className="btn btn-primary">
                    Admin Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-stats">
          <h2>Quick Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>0</h3>
              <p>Active Jobs</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Applications</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Interviews</p>
            </div>
            <div className="stat-card">
              <h3>0</h3>
              <p>Hired</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 