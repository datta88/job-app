import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, 
  FaLinkedin, FaGithub, FaBriefcase, FaGraduationCap, 
  FaSave, FaEdit, FaEye, FaEyeSlash, FaUpload, FaDownload,
  FaBuilding, FaMoneyBillWave, FaLaptop, FaMapPin
} from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    headline: '',
    summary: '',
    experience: '',
    education: '',
    skills: '',
    phone: '',
    address: '',
    website: '',
    linkedin: '',
    github: '',
    portfolio: '',
    yearsOfExperience: '',
    currentSalary: '',
    expectedSalary: '',
    preferredJobType: 'full-time',
    preferredLocation: '',
    isRemotePreferred: false,
    isPublic: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.profile) {
        setProfileData(prev => ({
          ...prev,
          ...response.data.profile
        }));
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/profiles', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match.');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setSaving(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1><FaUser /> My Profile</h1>
          <p>Manage your professional profile and account settings</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="profile-content">
          {/* Basic Information */}
          <div className="profile-section">
            <div className="section-header">
              <h2><FaUser /> Basic Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline-primary"
              >
                {isEditing ? <FaEye /> : <FaEdit />}
                {isEditing ? ' View' : ' Edit'}
              </button>
            </div>

            <div className="profile-card">
              <div className="user-info">
                <div className="avatar">
                  <FaUser />
                </div>
                <div className="user-details">
                  <h3>{user?.name}</h3>
                  <p className="email"><FaEnvelope /> {user?.email}</p>
                  <p className="role"><FaBriefcase /> {user?.role === 'jobseeker' ? 'Job Seeker' : 'Employer'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Profile */}
          <div className="profile-section">
            <div className="section-header">
              <h2><FaBriefcase /> Professional Profile</h2>
            </div>

            <div className="profile-card">
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="headline">Professional Headline</label>
                    <input
                      type="text"
                      id="headline"
                      name="headline"
                      value={profileData.headline}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      placeholder="e.g., Senior Full Stack Developer"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className="input-with-icon">
                      <FaPhone />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="summary">Professional Summary</label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={profileData.summary}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Write a compelling summary of your professional background, skills, and career objectives..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <div className="input-with-icon">
                      <FaMapMarkerAlt />
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="website">Website</label>
                    <div className="input-with-icon">
                      <FaGlobe />
                      <input
                        type="url"
                        id="website"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="linkedin">LinkedIn</label>
                    <div className="input-with-icon">
                      <FaLinkedin />
                      <input
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="github">GitHub</label>
                    <div className="input-with-icon">
                      <FaGithub />
                      <input
                        type="url"
                        id="github"
                        name="github"
                        value={profileData.github}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="experience">Work Experience</label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={profileData.experience}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    rows="4"
                    placeholder="Describe your work experience, including company names, positions, and key achievements..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education</label>
                  <textarea
                    id="education"
                    name="education"
                    value={profileData.education}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    rows="3"
                    placeholder="List your educational background, including degrees, institutions, and graduation years..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skills">Skills</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={profileData.skills}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    rows="3"
                    placeholder="List your technical and soft skills (comma-separated)..."
                  />
                </div>

                {user?.role === 'jobseeker' && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="yearsOfExperience">Years of Experience</label>
                        <input
                          type="number"
                          id="yearsOfExperience"
                          name="yearsOfExperience"
                          value={profileData.yearsOfExperience}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          min="0"
                          placeholder="5"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="preferredJobType">Preferred Job Type</label>
                        <select
                          id="preferredJobType"
                          name="preferredJobType"
                          value={profileData.preferredJobType}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                        >
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="contract">Contract</option>
                          <option value="internship">Internship</option>
                          <option value="freelance">Freelance</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="currentSalary">Current Salary</label>
                        <div className="input-with-icon">
                          <FaMoneyBillWave />
                          <input
                            type="text"
                            id="currentSalary"
                            name="currentSalary"
                            value={profileData.currentSalary}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            placeholder="$80,000"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="expectedSalary">Expected Salary</label>
                        <div className="input-with-icon">
                          <FaMoneyBillWave />
                          <input
                            type="text"
                            id="expectedSalary"
                            name="expectedSalary"
                            value={profileData.expectedSalary}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            placeholder="$100,000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="preferredLocation">Preferred Location</label>
                        <div className="input-with-icon">
                          <FaMapPin />
                          <input
                            type="text"
                            id="preferredLocation"
                            name="preferredLocation"
                            value={profileData.preferredLocation}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            placeholder="New York, NY"
                          />
                        </div>
                      </div>

                      <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            name="isRemotePreferred"
                            checked={profileData.isRemotePreferred}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                          />
                          <span className="checkmark"></span>
                          Prefer Remote Work
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isPublic"
                      checked={profileData.isPublic}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                    <span className="checkmark"></span>
                    Make profile public
                  </label>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-secondary"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <div className="spinner"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave /> Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="profile-section">
            <div className="section-header">
              <h2><FaEye /> Change Password</h2>
            </div>

            <div className="profile-card">
              <form onSubmit={handlePasswordSubmit} className="password-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <div className="input-with-icon">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="password-toggle"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-with-icon">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="input-with-icon">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <div className="spinner"></div>
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <FaSave /> Change Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 