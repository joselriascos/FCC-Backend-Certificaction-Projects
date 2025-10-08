const mongoose = require('mongoose')

const connectDB = async (dbName) => {
  if (mongoose.connection.readyState === 1) {
    // Already connected
    return mongoose.connection
  }

  const uri = process.env.MONGO_CONNECTION_STRING
  if (!uri) throw new Error('❌ MONGO_CONNECTION_STRING not found in .env')

  try {
    await mongoose.connect(uri, {
      dbName,
    })
    console.log('✅ Connected to MongoDB Atlas')
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message)
    throw err
  }
}

module.exports = connectDB
