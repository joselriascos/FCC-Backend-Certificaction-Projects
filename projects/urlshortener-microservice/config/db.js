const mongoose = require('mongoose')
require('dotenv').config()

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING

const connectDB = async (dbName) => {
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING, {
      dbName: dbName,
    })
    console.log('Connected to DB')
  } catch (err) {
    console.log(err)
  }
}

module.exports = connectDB
