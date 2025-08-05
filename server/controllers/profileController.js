const { Profile, User } = require('../models');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Create/Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      headline,
      summary,
      experience,
      education,
      skills,
      phone,
      address,
      website,
      linkedin,
      github,
      portfolio,
      is_public,
      years_of_experience,
      current_salary,
      expected_salary,
      preferred_job_type,
      preferred_location,
      is_remote_preferred
    } = req.body;

    // Handle empty strings for numeric fields
    const processedYearsOfExperience = years_of_experience === '' ? null : years_of_experience;

    let profile = await Profile.findOne({ where: { user_id: req.user.id } });

    if (!profile) {
      // Create new profile
      profile = await Profile.create({
        user_id: req.user.id,
        headline,
        summary,
        experience,
        education,
        skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
        phone,
        address,
        website,
        linkedin,
        github,
        portfolio,
        is_public,
        years_of_experience: processedYearsOfExperience,
        current_salary,
        expected_salary,
        preferred_job_type: preferred_job_type ? preferred_job_type.split(',').map(type => type.trim()) : ['full-time'],
        preferred_location: preferred_location ? preferred_location.split(',').map(loc => loc.trim()) : [],
        is_remote_preferred,
        resume: req.file ? req.file.filename : null
      });
    } else {
      // Update existing profile
      const updateData = {
        headline,
        summary,
        experience,
        education,
        phone,
        address,
        website,
        linkedin,
        github,
        portfolio,
        is_public,
        years_of_experience: processedYearsOfExperience,
        current_salary,
        expected_salary,
        is_remote_preferred
      };

      // Handle arrays
      if (skills) {
        updateData.skills = skills.split(',').map(skill => skill.trim());
      }
      if (preferred_job_type) {
        updateData.preferred_job_type = preferred_job_type.split(',').map(type => type.trim());
      }
      if (preferred_location) {
        updateData.preferred_location = preferred_location.split(',').map(loc => loc.trim());
      }

      // Handle resume upload
      if (req.file) {
        updateData.resume = req.file.filename;
      }

      await profile.update(updateData);
    }

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// Get public profile by user ID
const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOne({
      where: { user_id: userId, is_public: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found or not public' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get public profile error:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPublicProfile
}; 