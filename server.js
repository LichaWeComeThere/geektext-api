const express = require('express');
const mongoose = require('mongoose');
const ratingRoutes = require('./routes/ratings');

const app = express();
const host = '127.0.0.1';
const port = 3000;
// Temporary connection until Carlos's shared database setup lands on main.
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/geektext';

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, GeekText!' });
});

app.use('/books', ratingRoutes);

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(port, host, () => {
      console.log(`GeekText API running at http://${host}:${port}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
