import mongoose from 'mongoose';
import { config } from './config';
import { error } from 'console';

const connectDb = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log(`connected To Database successfully`);
    });

    mongoose.connection.on('error', (err) => {
      console.log(`Error in connecting to database`, err);
    });

    mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.log(`Failed To connect To Database..`);

    process.exit(1);
  }
};

export default connectDb;
