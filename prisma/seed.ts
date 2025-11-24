
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hash passwords
  const defaultPassword = await bcrypt.hash('password123', 10);
  const vibolPassword = await bcrypt.hash('Vibol2020', 10); // Hash for the new admin

  // Create Users
  const admin = await prisma.user.create({
    data: {
      email: 'vibolsen2002@gmail.com', // Updated email
      firstName: 'Vibol', // Updated first name
      lastName: 'Sen', // Updated last name
      password: vibolPassword, // Updated password
      role: Role.ADMIN,
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: 'teacher@step.com',
      firstName: 'Teacher',
      lastName: 'User',
      password: defaultPassword,
      role: Role.TEACHER,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@step.com',
      firstName: 'Student',
      lastName: 'User',
      password: defaultPassword,
      role: Role.STUDENT,
    },
  });

  console.log(`Created users:`, { admin, teacher, student });

  // Create Department
  const department = await prisma.department.create({
    data: {
      name: 'Computer Science',
    },
  });

  console.log(`Created department:`, department);

  // Create Courses
  const course1 = await prisma.course.create({
    data: {
      name: 'Introduction to Programming',
      leadById: teacher.id,
      courseDepartments: {
        create: {
          departmentId: department.id,
        },
      },
    },
  });

  const course2 = await prisma.course.create({
    data: {
      name: 'Data Structures and Algorithms',
      leadById: teacher.id,
      courseDepartments: {
        create: {
          departmentId: department.id,
        },
      },
    },
  });

  console.log(`Created courses:`, { course1, course2 });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
