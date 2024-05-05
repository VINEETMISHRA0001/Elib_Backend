import express from 'express';

const app = express();

// Routes

app.get('/', (req, res, next) => {
  res.json({ message: 'Hello From the server' });
});

export default app;
