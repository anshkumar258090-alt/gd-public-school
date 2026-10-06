const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('ℹ️ MONGODB_URI not provided. Running in local file storage mode.');
      return;
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB not connected (${error.message}).`);
    console.log('💡 Running with local file storage fallback (Server will stay online on port 5000).');
  }
};

module.exports = connectDB;
