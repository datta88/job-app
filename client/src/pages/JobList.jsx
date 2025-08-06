import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaClock, FaFilter } from 'react-icons/fa';
import './JobList.css';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experienceLevel: '',
    isRemote: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });

      const response = await axios.get(`https://job-app-961r.onrender.com/api/jobs?${params}`);
      setJobs(response.data.jobs);
      setTotalPages(response.data.totalPages);
      setError('');
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      isRemote: ''
    });
    setCurrentPage(1);
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      'full-time': 'badge-primary',
      'part-time': 'badge-success',
      'freelance': 'badge-warning',
      'contract': 'badge-info',
      'internship': 'badge-secondary'
    };
    return colors[jobType] || 'badge-primary';
  };

  const getExperienceColor = (level) => {
    const colors = {
      'entry': 'badge-success',
      'mid': 'badge-primary',
      'senior': 'badge-warning',
      'executive': 'badge-danger'
    };
    return colors[level] || 'badge-primary';
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="job-list-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-list-page">
      <div className="container">
        {/* Header */}
        <div className="job-list-header">
          <h1>Find Your Dream Job</h1>
          <p>Browse through thousands of job opportunities</p>
        </div>

        {/* Search and Filters */}
        <div className="search-filters-section">
          <div className="search-bar">
            <div className="input-group">
              <FaSearch className="search-icon" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search jobs, companies, or keywords..."
                className="form-control"
              />
            </div>
            <button
              className="btn btn-outline-primary filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="filters-panel">
              <div className="row">
                <div className="col-md-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="City, State, or Remote"
                    className="form-control"
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Job Type</label>
                  <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="freelance">Freelance</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Remote Work</label>
                  <select
                    name="isRemote"
                    value={filters.isRemote}
                    onChange={handleFilterChange}
                    className="form-control"
                  >
                    <option value="">All</option>
                    <option value="true">Remote Only</option>
                    <option value="false">On-site Only</option>
                  </select>
                </div>
              </div>
              <div className="filter-actions">
                <button className="btn btn-secondary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* Jobs List */}
        <div className="jobs-container">
          {jobs.length === 0 && !loading ? (
            <div className="no-jobs">
              <h3>No jobs found</h3>
              <p>Try adjusting your search criteria or check back later.</p>
            </div>
          ) : (
            <div className="jobs-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-card-header">
                    <h3 className="job-title">
                      <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                    </h3>
                    <div className="job-badges">
                      <span className={`badge ${getJobTypeColor(job.job_type)}`}>
                        {job.job_type?.replace('-', ' ') || 'Full Time'}
                      </span>
                      {job.is_remote && (
                        <span className="badge badge-success">Remote</span>
                      )}
                      <span className={`badge ${getExperienceColor(job.experience_level)}`}>
                        {job.experience_level || 'Mid Level'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="job-company">
                    <FaBuilding className="job-icon" />
                    <span>{job.company}</span>
                  </div>
                  
                  <div className="job-location">
                    <FaMapMarkerAlt className="job-icon" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="job-salary">
                    <FaBriefcase className="job-icon" />
                    <span>{job.salary}</span>
                  </div>
                  
                  <div className="job-description">
                    <p>{job.description?.substring(0, 150) || 'No description available'}...</p>
                  </div>
                  
                  <div className="job-card-footer">
                    <Link to={`/jobs/${job.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                    <small className="text-muted">
                      Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobList; 