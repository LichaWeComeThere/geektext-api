const express = require('express');

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, GeekText!' });
});

app.listen(port, host, () => {
  console.log(`GeekText API running at http://${host}:${port}`);
});
