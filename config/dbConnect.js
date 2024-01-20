import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Mongodb Connected ${connected.connection.host}`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default dbConnect;

