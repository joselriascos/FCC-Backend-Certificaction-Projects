import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import serverless from 'serverless-http'
import fileRouter from '../routes/fileRoutes.js'

dotenv.config()

const app = express()

const port = process.env.PORT || 0

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/', fileRouter)

// Serverless
export const handler = serverless(app)

// Local
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
