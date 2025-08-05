const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');
const Profile = require('./Profile');

// User associations
User.hasOne(Profile, { foreignKey: 'user_id', as: 'profile' });
User.hasMany(Job, { foreignKey: 'posted_by', as: 'postedJobs' });
User.hasMany(Application, { foreignKey: 'user_id', as: 'applications' });
User.hasMany(Application, { foreignKey: 'reviewed_by', as: 'reviewedApplications' });

// Profile associations
Profile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Job associations
Job.belongsTo(User, { foreignKey: 'posted_by', as: 'poster' });
Job.hasMany(Application, { foreignKey: 'job_id', as: 'applications' });

// Application associations
Application.belongsTo(User, { foreignKey: 'user_id', as: 'applicant' });
Application.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });
Application.belongsTo(Job, { foreignKey: 'job_id', as: 'job' });

module.exports = {
  User,
  Job,
  Application,
  Profile
}; 