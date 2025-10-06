const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const UrlController = require('../controllers/urls')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 0

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', UrlController.landingPage)
app.get('/api/shorturl/:shorturl', UrlController.redirectToUrl)
app.post('/api/shorturl/', UrlController.createUrl)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
