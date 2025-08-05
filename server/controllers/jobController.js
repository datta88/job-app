const { Job, User, Application } = require('../models');
const { Op } = require('sequelize');

// Get all jobs with filters
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel,
      isRemote,
      company
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_active: true };

    // Add search filters
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { requirements: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (location) {
      whereClause.location = { [Op.iLike]: `%${location}%` };
    }

    if (jobType) {
      whereClause.job_type = jobType;
    }

    if (experienceLevel) {
      whereClause.experience_level = experienceLevel;
    }

    if (isRemote !== undefined) {
      whereClause.is_remote = isRemote === 'true';
    }

    if (company) {
      whereClause.company = { [Op.iLike]: `%${company}%` };
    }

    const jobs = await Job.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      jobs: jobs.rows,
      total: jobs.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(jobs.count / limit)
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// Get single job
const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'poster',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};

// Create job (employers only)
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      company,
      salary,
      jobType,
      experienceLevel,
      isRemote,
      applicationDeadline,
      benefits,
      skills
    } = req.body;

    const job = await Job.create({
      title,
      description,
      requirements,
      location,
      company,
      salary,
      job_type: jobType,
      experience_level: experienceLevel,
      is_remote: isRemote,
      application_deadline: applicationDeadline,
      benefits,
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      posted_by: req.user.id
    });

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
};

// Update job (only job poster or admin)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user can update this job
    if (job.posted_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    // Handle skills array
    if (updateData.skills && typeof updateData.skills === 'string') {
      updateData.skills = updateData.skills.split(',').map(skill => skill.trim());
    }

    await job.update(updateData);

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Error updating job', error: error.message });
  }
};

// Delete job (only job poster or admin)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user can delete this job
    if (job.posted_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this job' });
    }

    await job.destroy();

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};

// Get jobs posted by current user
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: { posted_by: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Error fetching your jobs', error: error.message });
  }
};

module.exports = {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
}; 