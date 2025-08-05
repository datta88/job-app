import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaFileAlt, FaEye, FaClock, FaCheckCircle, FaTimesCircle, 
  FaHourglassHalf, FaMapMarkerAlt, FaMoneyBillWave, FaCalendarAlt,
  FaBriefcase, FaBuilding
} from 'react-icons/fa';
import './MyApplications.css';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://job-app-961r.onrender.com/api/applications/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch your applications. Please try again.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <FaClock className="status-pending" />;
      case 'accepted':
        return <FaCheckCircle className="status-accepted" />;
      case 'rejected':
        return <FaTimesCircle className="status-rejected" />;
      case 'reviewing':
        return <FaHourglassHalf className="status-reviewing" />;
      default:
        return <FaClock className="status-pending" />;
    }
  };

  const getStatusText = (status) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending';
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      case 'reviewing':
        return 'status-reviewing';
      default:
        return 'status-pending';
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(app => 
      app.status?.toLowerCase() === status?.toLowerCase()
    ).length;
  };

  if (loading) {
    return (
      <div className="my-applications-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-applications-page">
      <div className="container">
        <div className="my-applications-header">
          <h1><FaFileAlt /> My Applications</h1>
          <p>Track your job applications and their status</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="my-applications-content">
          {applications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaFileAlt />
              </div>
              <h3>No Applications Yet</h3>
              <p>You haven't applied to any jobs yet. Start browsing and applying to find your next opportunity.</p>
              <button
                onClick={() => navigate('/jobs')}
                className="btn btn-primary"
              >
                <FaBriefcase /> Browse Jobs
              </button>
            </div>
          ) : (
            <>
              {/* Application Statistics */}
              <div className="applications-summary">
                <div className="summary-card">
                  <h3>Application Summary</h3>
                  <div className="summary-stats">
                    <div className="stat">
                      <span className="stat-number">{applications.length}</span>
                      <span className="stat-label">Total Applications</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{getStatusCount('pending')}</span>
                      <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{getStatusCount('reviewing')}</span>
                      <span className="stat-label">Under Review</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{getStatusCount('accepted')}</span>
                      <span className="stat-label">Accepted</span>
                    </div>
                    <div className="stat">
                      <span className="stat-number">{getStatusCount('rejected')}</span>
                      <span className="stat-label">Rejected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications List */}
              <div className="applications-list">
                <h3>Recent Applications</h3>
                <div className="applications-grid">
                  {applications.map(application => (
                    <div key={application.id} className="application-card">
                      <div className="application-header">
                        <div className="job-info">
                          <h4>{application.job?.title}</h4>
                          <div className="company-info">
                            <FaBuilding />
                            <span>{application.job?.company}</span>
                          </div>
                        </div>
                        <div className="application-status">
                          {getStatusIcon(application.status)}
                          <span className={getStatusClass(application.status)}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                      </div>

                      <div className="job-details">
                        <div className="job-detail">
                          <FaMapMarkerAlt />
                          <span>{application.job?.location}</span>
                          {application.job?.isRemote && (
                            <span className="remote-badge">Remote</span>
                          )}
                        </div>
                        
                        {application.job?.salary && (
                          <div className="job-detail">
                            <FaMoneyBillWave />
                            <span>{application.job.salary}</span>
                          </div>
                        )}
                        
                        <div className="job-detail">
                          <FaBriefcase />
                          <span className="capitalize">{application.job?.jobType}</span>
                        </div>
                      </div>

                      <div className="application-details">
                        <div className="application-date">
                          <FaCalendarAlt />
                          <span>Applied: {formatDate(application.createdAt)}</span>
                        </div>
                        
                        {application.updatedAt !== application.createdAt && (
                          <div className="application-updated">
                            <FaCalendarAlt />
                            <span>Updated: {formatDate(application.updatedAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="application-actions">
                        <button
                          onClick={() => handleViewJob(application.jobId)}
                          className="btn btn-outline-primary"
                        >
                          <FaEye /> View Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications; 