import { faker } from '@faker-js/faker';

export const generateUserData = (request, ctx) => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'testpass123'
  };
};

export const generateJobData = (request, ctx) => {
  return {
    title: faker.person.jobTitle(),
    company: faker.company.name(),
    location: faker.location.city() + ', ' + faker.location.country(),
    employmentType: faker.helpers.arrayElement(['full-time', 'part-time', 'contract', 'internship']),
    description: faker.lorem.paragraph(),
    skillsRequired: faker.helpers.arrayElements(['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git'], { min: 2, max: 5 })
  };
};

export const generateCourseData = (request, ctx) => {
  return {
    title: faker.helpers.arrayElement(['Web Development', 'Data Science', 'Mobile Apps', 'Cloud Computing']) + ' ' + faker.helpers.arrayElement(['Basics', 'Fundamentals', 'Advanced', 'Masterclass']),
    description: faker.lorem.paragraph(),
    category: faker.helpers.arrayElement(['Programming', 'Design', 'Business', 'Marketing']),
    provider: faker.helpers.arrayElement(['SLIIT', 'Coursera', 'Udemy', 'edX']),
    level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
    location: faker.location.city()
  };
};

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
