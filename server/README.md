# Job Portal Server

Backend API for the Job Portal application built with Node.js, Express, and PostgreSQL.

## Features

- User authentication with JWT
- Role-based authorization (jobseeker, employer, admin)
- Job posting and management
- Job applications with status tracking
- User profiles for job seekers
- File upload for resumes
- RESTful API design

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `config.env.example` to `config.env`
   - Update database credentials and JWT secret

3. Create PostgreSQL database:
```sql
CREATE DATABASE job_portal;
```

4. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employers only)
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/my/jobs` - Get user's posted jobs

### Applications
- `POST /api/applications/jobs/:jobId/apply` - Apply for job
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/jobs/:jobId` - Get job applications (employers)
- `PUT /api/applications/:id/status` - Update application status

### Profiles
- `GET /api/profiles/me` - Get user profile
- `PUT /api/profiles/me` - Update profile
- `GET /api/profiles/:userId` - Get public profile

## Environment Variables

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## Database Schema

The application uses the following main tables:
- `users` - User accounts and authentication
- `jobs` - Job listings
- `applications` - Job applications
- `profiles` - User profiles for job seekers

## File Structure

```
server/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── jobController.js
│   ├── applicationController.js
│   └── profileController.js
├── middleware/
│   ├── auth.js
│   └── upload.js
├── models/
│   ├── User.js
│   ├── Job.js
│   ├── Application.js
│   ├── Profile.js
│   └── index.js
├── routes/
│   ├── auth.js
│   ├── jobs.js
│   ├── applications.js
│   ├── profiles.js
│   └── users.js
├── uploads/
├── server.js
├── package.json
└── README.md
``` 