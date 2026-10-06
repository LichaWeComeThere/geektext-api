require('dotenv').config();

const express = require('express');
const connectDB = require('./config/db');
const ratingRoutes = require('./routes/ratings');
const browsingRoutes = require('./routes/browsing');
const bookDetailsRoutes = require('./routes/bookDetails');
const cartRoutes = require('./routes/cart');
const userRoutes = require('./routes/users');
const wishlistRoutes = require('./routes/wishlists');

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, GeekText!' });
});

app.use('/api/books', ratingRoutes);
app.use('/api/books', browsingRoutes);
app.use('/api/books', bookDetailsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlists', wishlistRoutes);

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
