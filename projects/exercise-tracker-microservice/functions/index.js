import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import serverless from 'serverless-http'
import { randomUUID } from 'crypto'
import fs from 'fs/promises'  // Importar fs.promises
import path from 'path'
import { validateExercise, validateQuery, validateUser } from '../schemas'

dotenv.config()

const port = process.env.PORT || 0
const app = express()

const LOGS_FILE_PATH = path.join(__dirname, '../logs.json')

// Middlewares
app.use(cors())
app.use(express.json())

// Helper to read logs asynchronously from JSON file
const readLogs = async () => {
  try {
    const data = await fs.readFile(LOGS_FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading logs file:', error)
    throw new Error('Failed to read logs')
  }
}

// Helper to write logs asynchronously to the JSON file
const writeLogs = async (logs) => {
  try {
    await fs.writeFile(LOGS_FILE_PATH, JSON.stringify(logs, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing to logs file:', error)
    throw new Error('Failed to write logs')
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.get('/api/users', async (req, res) => {
  try {
    const logs = await readLogs()
    const users = logs.map((log) => {
      const { _id, username } = log
      return { username, _id }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/api/users/:id/exercises', async (req, res) => {
  const { id } = req.params
  const validation = validateExercise(req.body)

  if (!validation.success)
    return res.status(400).json({ error: 'Invalid exercise' })

  const { description, duration, date } = validation.data

  try {
    const logs = await readLogs()
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

    await writeLogs(logs)  // Asynchronously write logs to the file
    return res.json(newExercise)
  } catch (error) {
    res.status(500).json({ error: 'Failed to save exercise' })
  }
})

app.post('/api/users', async (req, res) => {
  const validation = validateUser(req.body)

  if (!validation.success)
    return res.status(400).json({ error: 'Invalid user' })

  const { username } = validation.data

  try {
    const logs = await readLogs()
    const user = logs.find((log) => log.username === username)

    if (user) {
      return res.json({
        username: user.username,
        _id: user._id,
      })
    }

    const newUser = {
      username,
      _id: randomUUID(),
    }

    logs.push({
      username: newUser.username,
      count: 0,
      _id: newUser._id,
      log: [],
    })

    await writeLogs(logs)  // Asynchronously write logs to the file
    res.json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

app.get('/api/users/:id/logs', async (req, res) => {
  const { id } = req.params
  const validation = validateQuery(req.query)

  if (!validation.success)
    return res.status(400).json({ error: 'Invalid query' })

  const { from, to, limit } = validation.data

  try {
    const logs = await readLogs()
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch logs' })
  }
})

export const handler = serverless(app)
