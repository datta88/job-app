const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
 
const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false
  },
  job_type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'freelance', 'contract', 'internship'),
    defaultValue: 'full-time',
    allowNull: false
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'mid', 'senior', 'executive'),
    defaultValue: 'mid'
  },
  is_remote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  posted_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
}, {
  tableName: 'jobs',
  indexes: [
    {
      fields: ['title']
    },
    {
      fields: ['location']
    },
    {
      fields: ['company']
    },
    {
      fields: ['job_type']
    },
    {
      fields: ['is_active']
    }
  ]
});
 
module.exports = Job;
 