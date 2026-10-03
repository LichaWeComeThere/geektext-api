require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const users = [
  {
    username: 'alice.reader',
    password: 'Password123!',
    firstName: 'Alice',
    lastName: 'Reader',
    email: 'alice.reader@example.com',
    homeAddress: '100 Example Avenue, Miami, FL 33101'
  },
  {
    username: 'bob.books',
    password: 'Password123!',
    firstName: 'Bob',
    lastName: 'Books',
    email: 'bob.books@example.com',
    homeAddress: '200 Sample Street, Miami, FL 33102'
  },
  {
    username: 'charlie.tech',
    password: 'Password123!',
    firstName: 'Charlie',
    lastName: 'Tech',
    email: 'charlie.tech@example.com',
    homeAddress: '300 Demo Road, Miami, FL 33103'
  }
];

async function seedDatabase() {
  try {
    await connectDB();

    const usernames = users.map((user) => user.username);

    await User.deleteMany({
      username: { $in: usernames }
    });

    await User.create(users);

    console.log(`Seeded ${users.length} fake users.`);
  } catch (error) {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();