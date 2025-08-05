const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
 
const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  applied_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interview_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interview_location: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'applications',
  indexes: [
    {
      fields: ['job_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['job_id', 'user_id']
    }
  ]
});
 
module.exports = Application;
 