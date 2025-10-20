const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const serverless = require('serverless-http')
const fileRouter = require('../routes/fileRoutes.js')

dotenv.config()

const app = express()

const port = process.env.PORT || 0

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/', fileRouter)

// Serverless
module.exports.handler = serverless(app)

// Local
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
