import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import serverless from 'serverless-http'
import { randomUUID } from 'crypto'
import logs from '../logs.json' with { type: 'json' }

dotenv.config()

const port = process.env.PORT || 0
const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  // TODO: aquí va a devolver un html estático
  res.json({ message: 'Hello World' })
})

app.get('/api/users', (req, res) => {
  // Returns all users

  res.json([
    logs.map((log) => {
      const { _id, username } = log
      return { _id, username }
    }),
  ])
})

app.post('/api/users/:id/exercises', (req, res) => {
  const { id } = req.params
  const { description, duration, date } = req.body

  const logIndex = logs.findIndex((log) => log._id === id)

  if (logIndex === -1) return res.status(404).json({ error: 'User not found' })

  const user = logs[logIndex]

  const newDate = date ? new Date(date + 'T00:00:00') : new Date()

  const newLog = {
    description,
    duration: parseInt(duration),
    date: newDate.toDateString(),
  }

  user.count += 1
  user.log.push(newLog)

  const newExercise = {
    username: user.username,
    description,
    duration: parseInt(duration),
    date: newDate.toDateString(),
    _id: user._id,
  }

  return res.json(newExercise)
})

app.post('/api/users', (req, res) => {
  const { username } = req.body

  const user = logs.find((log) => log.username === username)

  if (user)
    return res.json({
      username: user.username,
      _id: user._id,
    })

  const newUser = {
    username,
    _id: randomUUID(),
  }

  logs.push({
    username: newUser.username,
    count: 0,
    _id: newUser._id,
    logs: [],
  })

  res.json(newUser)
})

app.get('/api/users/:id/logs', (req, res) => {
  const { id } = req.params
  const { from, to, limit } = req.query

  const user = logs.find((log) => log._id === id)

  if (!user) return res.status(404).json({ error: 'User not found' })

  if (!from && !to && !limit) {
    return res.json(user)
  }

  const fromData = from ? new Date(from) : new Date(0)
  const toData = to ? new Date(to) : new Date()
  const limitData = limit ? parseInt(limit) : 0

  const filteredLogs = user.log
    .filter((log) => {
      const logDate = new Date(log.date)
      return logDate >= fromData && logDate <= toData
    })
    .slice(0, limitData)

  return res.json({
    ...user,
    count: filteredLogs.length,
    log: filteredLogs,
  })
})

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`)
// })

export const handler = serverless(app)
