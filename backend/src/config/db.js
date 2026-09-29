const mongoose = require('mongoose');

let isMongoConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/maildrishti', {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.log(`[Database] MongoDB server not detected locally. Operating in Resilient Embedded Data Store mode.`);
  }
};

const getDBStatus = () => isMongoConnected;

module.exports = { connectDB, getDBStatus };
