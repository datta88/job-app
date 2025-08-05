const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
 
const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  headline: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true
  },
  github: {
    type: DataTypes.STRING,
    allowNull: true
  },
  portfolio: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 50
    },
    set(value) {
      // Convert empty string to null
      if (value === '' || value === null || value === undefined) {
        this.setDataValue('yearsOfExperience', null);
      } else {
        this.setDataValue('yearsOfExperience', parseInt(value));
      }
    }
  },
  current_salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expected_salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferred_job_type: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['full-time']
  },
  preferred_location: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isRemotePreferred: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'profiles'
});
 
module.exports = Profile;
 