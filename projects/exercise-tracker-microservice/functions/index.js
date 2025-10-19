import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import serverless from 'serverless-http'
import connectDB from '../config/db.js'
import {
  showHome,
  getUsers,
  addLog,
  addUser,
  getLogs,
} from '../controllers/logs.js'

dotenv.config()

const port = process.env.PORT || 0
const app = express()

// Connect to database
app.use(async (req, res, next) => {
  connectDB('Exercise-tracker')
  next()
})

// Middlewares
app.use(cors())
app.use(express.json())

app.get('/', showHome)
app.get('/api/users', getUsers)
app.post('/api/users/:id/exercises', addLog)
app.post('/api/users', addUser)
app.get('/api/users/:id/logs', getLogs)

export const handler = serverless(app)

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`)
// })
