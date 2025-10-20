import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import serverless from 'serverless-http'
import fileRouter from '../routes/fileRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const port = process.env.PORT || 0

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})
app.use('/', fileRouter)

// Serverless
export const handler = serverless(app)

// Local
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
