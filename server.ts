// not setting up espress here , only setting up server in this file
import app from './src/app';

const startServer = () => {
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Server is Listening on Port: ${port}`);
  });
};

startServer();
