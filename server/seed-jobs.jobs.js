const { sequelize } = require('./config/database');
const { User, Job } = require('./models');
 
const sampleJobs = [
  {
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user-friendly web applications using React, JavaScript, and modern CSS frameworks.',
    requirements: '3+ years of experience with React, JavaScript, HTML, CSS. Experience with TypeScript and modern build tools preferred.',
    location: 'New York, NY',
    company: 'TechCorp Inc.',
    salary: '$80,000 - $120,000',
    job_type: 'full-time',
    experience_level: 'mid',
    is_remote: false,
    is_active: true,
    benefits: 'Health insurance, 401k, flexible PTO, remote work options',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript']
  },
  {
    title: 'Backend Engineer',
    description: 'Join our backend team to build scalable APIs and microservices. You will work with Node.js, Express, and PostgreSQL to create robust server-side applications.',
    requirements: '2+ years of experience with Node.js, Express, PostgreSQL. Knowledge of RESTful APIs and microservices architecture.',
    location: 'San Francisco, CA',
    company: 'StartupXYZ',
    salary: '$90,000 - $130,000',
    job_type: 'full-time',
    experience_level: 'mid',
    is_remote: true,
    is_active: true,
    benefits: 'Competitive salary, equity, health benefits, unlimited PTO',
    skills: ['Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'Microservices']
  },
  {
    title: 'UX/UI Designer',
    description: 'We need a creative UX/UI Designer to help us create beautiful and intuitive user experiences. You will work closely with our product and development teams.',
    requirements: 'Portfolio demonstrating user-centered design solutions. Experience with Figma, Sketch, or similar design tools.',
    location: 'Austin, TX',
    company: 'Design Studio Pro',
    salary: '$70,000 - $100,000',
    job_type: 'full-time',
    experience_level: 'mid',
    is_remote: true,
    is_active: true,
    benefits: 'Health insurance, professional development budget, flexible hours',
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Prototyping']
  },
  {
    title: 'Data Scientist',
    description: 'Join our data team to analyze complex datasets and build machine learning models. You will help drive business decisions through data insights.',
    requirements: 'Masters degree in Statistics, Computer Science, or related field. Experience with Python, R, SQL, and machine learning libraries.',
    location: 'Seattle, WA',
    company: 'DataTech Solutions',
    salary: '$100,000 - $150,000',
    job_type: 'full-time',
    experience_level: 'senior',
    is_remote: false,
    is_active: true,
    benefits: 'Competitive salary, stock options, health benefits, learning budget',
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics']
  },
  {
    title: 'DevOps Engineer',
    description: 'Help us build and maintain our cloud infrastructure. You will work with AWS, Docker, Kubernetes, and CI/CD pipelines.',
    requirements: '3+ years of experience with AWS, Docker, Kubernetes. Experience with Terraform and CI/CD tools.',
    location: 'Remote',
    company: 'CloudFirst Inc.',
    salary: '$85,000 - $125,000',
    job_type: 'full-time',
    experience_level: 'mid',
    is_remote: true,
    is_active: true,
    benefits: 'Remote work, health insurance, 401k, professional development',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD']
  },
  {
    title: 'Marketing Intern',
    description: 'Gain hands-on experience in digital marketing. You will assist with social media management, content creation, and campaign analysis.',
    requirements: 'Currently pursuing a degree in Marketing, Communications, or related field. Strong writing and social media skills.',
    location: 'Chicago, IL',
    company: 'Growth Marketing Co.',
    salary: '$20/hour',
    job_type: 'internship',
    experience_level: 'entry',
    is_remote: false,
    is_active: true,
    benefits: 'Flexible schedule, mentorship, potential for full-time role',
    skills: ['Social Media Marketing', 'Content Creation', 'Analytics', 'Copywriting']
  },
  {
    title: 'Product Manager',
    description: 'Lead product strategy and development for our SaaS platform. You will work with cross-functional teams to deliver exceptional user experiences.',
    requirements: '5+ years of product management experience. Strong analytical and communication skills. Experience with agile methodologies.',
    location: 'Boston, MA',
    company: 'SaaS Solutions',
    salary: '$120,000 - $160,000',
    job_type: 'full-time',
    experience_level: 'senior',
    is_remote: true,
    is_active: true,
    benefits: 'Competitive salary, equity, health benefits, flexible work',
    skills: ['Product Strategy', 'Agile', 'User Research', 'Analytics', 'Leadership']
  },
  {
    title: 'Mobile App Developer',
    description: 'Build native iOS and Android applications. You will work with React Native or Flutter to create cross-platform mobile apps.',
    requirements: '2+ years of mobile development experience. Knowledge of React Native, Flutter, or native iOS/Android development.',
    location: 'Denver, CO',
    company: 'MobileFirst Apps',
    salary: '$75,000 - $110,000',
    job_type: 'full-time',
    experience_level: 'mid',
    is_remote: true,
    is_active: true,
    benefits: 'Health insurance, 401k, flexible PTO, remote work',
    skills: ['React Native', 'Flutter', 'JavaScript', 'Mobile Development']
  }
];
 
const seedJobs = async () => {
  try {
    // Sync database
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully');
 
    // Check if we have any users to assign jobs to
    const users = await User.findAll();
   
    if (users.length === 0) {
      console.log('No users found. Please create users first before seeding jobs.');
      return;
    }
 
    // Get the first user as the job poster
    const jobPoster = users[0];
 
    // Add jobs to the database
    for (const jobData of sampleJobs) {
      await Job.create({
        ...jobData,
        posted_by: jobPoster.id
      });
    }
 
    console.log(`Successfully seeded ${sampleJobs.length} jobs to the database!`);
    console.log('You can now visit the jobs section to see the sample jobs.');
 
  } catch (error) {
    console.error('Error seeding jobs:', error);
  } finally {
    await sequelize.close();
  }
};
 
// Run the seed function
seedJobs();
 