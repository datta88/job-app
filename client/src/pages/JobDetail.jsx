import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaBriefcase, FaMapMarkerAlt, FaMoneyBillWave, FaClock, 
  FaGraduationCap, FaLaptop, FaBuilding, FaCalendarAlt,
  FaArrowLeft, FaPaperPlane, FaCheckCircle, FaTimesCircle,
  FaEye, FaDownload, FaExternalLinkAlt
} from 'react-icons/fa';
import './JobDetail.css';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://job-app-961r.onrender.com/api/jobs/${id}`);
      setJob(response.data);
      
      // Check if user has already applied
      if (user) {
        checkApplicationStatus();
      }
    } catch (err) {
      setError('Failed to fetch job details. Please try again.');
      console.error('Error fetching job:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      // Get user's applications and check if they applied for this job
      const response = await axios.get(`https://job-app-961r.onrender.com/api/applications/my`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Check if user has applied for this specific job
      const hasAppliedForThisJob = response.data.some(application => application.jobId === parseInt(id));
      setHasApplied(hasAppliedForThisJob);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'jobseeker') {
      setError('Only job seekers can apply for jobs.');
      return;
    }

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`https://job-app-961r.onrender.com/api/applications/jobs/${id}/apply`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Application submitted successfully!');
      setHasApplied(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDeadline = (dateString) => {
    const deadline = new Date(dateString);
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Deadline passed';
    } else if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Tomorrow';
    } else {
      return `${diffDays} days left`;
    }
  };

  if (loading) {
    return (
      <div className="job-detail-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-detail-page">
        <div className="container">
          <div className="error-container">
            <h2>Job Not Found</h2>
            <p>The job you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/jobs')} className="btn btn-primary">
              <FaArrowLeft /> Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <div className="container">
        <div className="job-detail-header">
          <button onClick={() => navigate('/jobs')} className="back-btn">
            <FaArrowLeft /> Back to Jobs
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="job-detail-content">
          <div className="job-main">
            <div className="job-header">
              <div className="job-title-section">
                <h1>{job.title}</h1>
                <div className="company-info">
                  <FaBuilding />
                  <span>{job.company}</span>
                </div>
              </div>
              
              <div className="job-actions">
                {user?.role === 'jobseeker' && !hasApplied && (
                  <button
                    onClick={handleApply}
                    className="btn btn-primary apply-btn"
                    disabled={applying}
                  >
                    {applying ? (
                      <>
                        <div className="spinner"></div>
                        Applying...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Apply Now
                      </>
                    )}
                  </button>
                )}
                
                {hasApplied && (
                  <div className="applied-badge">
                    <FaCheckCircle />
                    <span>Applied</span>
                  </div>
                )}
              </div>
            </div>

            <div className="job-meta">
              <div className="meta-item">
                <FaMapMarkerAlt />
                <span>{job.location}</span>
                {job.isRemote && <span className="remote-badge">Remote</span>}
              </div>
              
              {job.salary && (
                <div className="meta-item">
                  <FaMoneyBillWave />
                  <span>{job.salary}</span>
                </div>
              )}
              
              <div className="meta-item">
                <FaClock />
                <span className="capitalize">{job.jobType}</span>
              </div>
              
              <div className="meta-item">
                <FaGraduationCap />
                <span className="capitalize">{job.experienceLevel} Level</span>
              </div>
              
              <div className="meta-item">
                <FaCalendarAlt />
                <span>Posted: {formatDate(job.createdAt)}</span>
              </div>
              
              {job.applicationDeadline && (
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span className={formatDeadline(job.applicationDeadline) === 'Deadline passed' ? 'deadline-passed' : ''}>
                    {formatDeadline(job.applicationDeadline)}
                  </span>
                </div>
              )}
            </div>

            <div className="job-sections">
              <div className="job-section">
                <h3>Job Description</h3>
                <div className="section-content">
                  <p>{job.description}</p>
                </div>
              </div>

              <div className="job-section">
                <h3>Requirements</h3>
                <div className="section-content">
                  <p>{job.requirements}</p>
                </div>
              </div>

              {job.skills && job.skills.length > 0 && (
                <div className="job-section">
                  <h3>Required Skills</h3>
                  <div className="section-content">
                    <div className="skills-list">
                      {Array.isArray(job.skills) ? 
                        job.skills.map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill}
                          </span>
                        )) : 
                        job.skills.split(',').map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill.trim()}
                          </span>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}

              {job.benefits && (
                <div className="job-section">
                  <h3>Benefits & Perks</h3>
                  <div className="section-content">
                    <p>{job.benefits}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="job-sidebar">
            <div className="sidebar-card">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                {user?.role === 'jobseeker' && !hasApplied && (
                  <button
                    onClick={handleApply}
                    className="btn btn-primary full-width"
                    disabled={applying}
                  >
                    {applying ? (
                      <>
                        <div className="spinner"></div>
                        Applying...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Apply for this Job
                      </>
                    )}
                  </button>
                )}
                
                {hasApplied && (
                  <div className="applied-status">
                    <FaCheckCircle />
                    <span>You've applied for this position</span>
                  </div>
                )}
                
                <button className="btn btn-outline-primary full-width">
                  <FaEye /> Save Job
                </button>
                
                <button className="btn btn-outline-secondary full-width">
                  <FaExternalLinkAlt /> Share Job
                </button>
              </div>
            </div>

            <div className="sidebar-card">
              <h3>Job Summary</h3>
              <div className="summary-list">
                <div className="summary-item">
                  <span className="label">Company:</span>
                  <span className="value">{job.company}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Location:</span>
                  <span className="value">{job.location}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Job Type:</span>
                  <span className="value capitalize">{job.jobType}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Experience:</span>
                  <span className="value capitalize">{job.experienceLevel}</span>
                </div>
                {job.salary && (
                  <div className="summary-item">
                    <span className="label">Salary:</span>
                    <span className="value">{job.salary}</span>
                  </div>
                )}
                <div className="summary-item">
                  <span className="label">Remote:</span>
                  <span className="value">{job.isRemote ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </div>

            {user?.role === 'employer' && job.postedBy === user.id && (
              <div className="sidebar-card">
                <h3>Employer Actions</h3>
                <div className="action-buttons">
                  <button className="btn btn-outline-primary full-width">
                    <FaEye /> View Applications
                  </button>
                  <button className="btn btn-outline-secondary full-width">
                    <FaDownload /> Edit Job
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail; 