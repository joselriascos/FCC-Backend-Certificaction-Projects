const express = require('express')
const cors = require('cors')
const serverless = require('serverless-http')

require('dotenv').config()

const UrlController = require('../controllers/urls.js')
const connectDB = require('../config/db.js')
const errorHandler = require('../middlewares/errorHandler.js')

const app = express()
const PORT = process.env.PORT || 0

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Conect to DB
app.use(async (req, res, next) => {
  await connectDB('shortener')
  next()
})

// Routes
app.get('/', UrlController.landingPage)
app.get('/api/shorturl/:shorturl', UrlController.redirectToUrl)
app.post('/api/shorturl/', UrlController.createUrl)

// Global error handler middleware
// app.use(errorHandler)

// Start server
module.exports.handler = serverless(app)

// For local
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
