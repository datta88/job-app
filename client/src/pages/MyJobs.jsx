import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaBriefcase, FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, 
  FaMoneyBillWave, FaClock, FaUsers, FaCalendarAlt, FaLaptop,
  FaCheckCircle, FaTimesCircle, FaPauseCircle
} from 'react-icons/fa';
import './MyJobs.css';

const MyJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/jobs/my/jobs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch your jobs. Please try again.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(jobId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (err) {
      setError('Failed to delete job. Please try again.');
      console.error('Error deleting job:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/edit-job/${jobId}`);
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/jobs/${jobId}`, {
        isActive: !currentStatus
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setJobs(jobs.map(job => 
        job.id === jobId ? { ...job, isActive: !currentStatus } : job
      ));
    } catch (err) {
      setError('Failed to update job status. Please try again.');
      console.error('Error updating job status:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (isActive) => {
    return isActive ? <FaCheckCircle className="status-active" /> : <FaPauseCircle className="status-inactive" />;
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <div className="my-jobs-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your job postings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-jobs-page">
      <div className="container">
        <div className="my-jobs-header">
          <div className="header-content">
            <h1><FaBriefcase /> My Job Postings</h1>
            <p>Manage and track your job listings</p>
          </div>
          <button
            onClick={() => navigate('/post-job')}
            className="btn btn-primary"
          >
            <FaPlus /> Post New Job
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="my-jobs-content">
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaBriefcase />
              </div>
              <h3>No Job Postings Yet</h3>
              <p>You haven't posted any jobs yet. Start by creating your first job listing.</p>
              <button
                onClick={() => navigate('/post-job')}
                className="btn btn-primary"
              >
                <FaPlus /> Post Your First Job
              </button>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div className="job-title-section">
                      <h3>{job.title}</h3>
                      <div className="job-status">
                        {getStatusIcon(job.isActive)}
                        <span className={job.isActive ? 'status-active' : 'status-inactive'}>
                          {getStatusText(job.isActive)}
                        </span>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className="btn btn-outline-primary btn-sm"
                        title="View Job"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditJob(job.id)}
                        className="btn btn-outline-secondary btn-sm"
                        title="Edit Job"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="btn btn-outline-danger btn-sm"
                        title="Delete Job"
                        disabled={deleteLoading === job.id}
                      >
                        {deleteLoading === job.id ? (
                          <div className="spinner-sm"></div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="job-company">
                    <FaBriefcase />
                    <span>{job.company}</span>
                  </div>

                  <div className="job-details">
                    <div className="job-detail">
                      <FaMapMarkerAlt />
                      <span>{job.location}</span>
                      {job.isRemote && <span className="remote-badge">Remote</span>}
                    </div>
                    
                    {job.salary && (
                      <div className="job-detail">
                        <FaMoneyBillWave />
                        <span>{job.salary}</span>
                      </div>
                    )}
                    
                    <div className="job-detail">
                      <FaClock />
                      <span className="capitalize">{job.jobType}</span>
                    </div>
                    
                    <div className="job-detail">
                      <FaUsers />
                      <span className="capitalize">{job.experienceLevel} Level</span>
                    </div>
                  </div>

                  <div className="job-description">
                    <p>{job.description.substring(0, 150)}...</p>
                  </div>

                  <div className="job-footer">
                    <div className="job-date">
                      <FaCalendarAlt />
                      <span>Posted: {formatDate(job.createdAt)}</span>
                    </div>
                    
                    <button
                      onClick={() => handleToggleStatus(job.id, job.isActive)}
                      className={`btn btn-sm ${job.isActive ? 'btn-warning' : 'btn-success'}`}
                    >
                      {job.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {jobs.length > 0 && (
          <div className="jobs-summary">
            <div className="summary-card">
              <h3>Summary</h3>
              <div className="summary-stats">
                <div className="stat">
                  <span className="stat-number">{jobs.length}</span>
                  <span className="stat-label">Total Jobs</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{jobs.filter(job => job.isActive).length}</span>
                  <span className="stat-label">Active Jobs</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{jobs.filter(job => !job.isActive).length}</span>
                  <span className="stat-label">Inactive Jobs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs; 