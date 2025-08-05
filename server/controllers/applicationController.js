const { Application, Job, User, Profile } = require('../models');

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;
    const userId = req.user.id;

    // Check if job exists and is active
    const job = await Job.findByPk(jobId);
    if (!job || !job.is_active) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      where: { job_id: jobId, user_id: userId }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create application
    const application = await Application.create({
      job_id: jobId,
      user_id: userId,
      cover_letter: coverLetter,
      resume: req.file ? req.file.filename : null
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Error applying for job', error: error.message });
  }
};

// Get user's applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'poster',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['applied_at', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Get applications for a job (employers only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if user owns this job or is admin
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.posted_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these applications' });
    }

    const applications = await Application.findAll({
      where: { job_id: jobId },
      include: [
        {
          model: User,
          as: 'applicant',
          include: [
            {
              model: Profile,
              as: 'profile'
            }
          ]
        }
      ],
      order: [['applied_at', 'DESC']]
    });

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// Update application status (employers only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, interviewDate, interviewLocation } = req.body;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job'
        }
      ]
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user can update this application
    if (application.job.posted_by !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    await application.update({
      status,
      notes,
      interview_date: interviewDate,
      interview_location: interviewLocation,
      reviewed_at: new Date(),
      reviewed_by: req.user.id
    });

    res.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Error updating application status', error: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
}; 