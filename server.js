require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, GeekText!' });
});

async function startServer() {
  try {
    await connectDB();

    app.listen(port, host, () => {
      console.log(`GeekText API running at http://${host}:${port}`);
    });
  } catch (error) {
    console.error('Failed to start GeekText API:', error);
    process.exit(1);
  }
}

startServer();