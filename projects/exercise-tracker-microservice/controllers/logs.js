import UserModel from '../models/logs.js'
import { validateExercise, validateQuery, validateUser } from '../schemas.js'

export const showHome = (req, res) => {
  // Returns home page
  return res.json({ message: 'Hello World' })
}

export const getUsers = async (req, res) => {
  // Returns all the users
  try {
    const users = await UserModel.find().select('username _id')
    if (users) return res.json(users)
    return res.status(404).json({ message: 'Users not found' })
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const addLog = async (req, res) => {
  // Add new log to an existing user and returns the new exercise added
  const { id } = req.params
  const validation = validateExercise(req.body)

  if (!validation.success)
    return res.status(400).json({ error: 'Invalid exercise' })

  const { description, duration, date } = validation.data
  try {
    const user = await UserModel.findOne({ _id: id })
    if (!user) return res.status(404).json({ error: 'User not found' })
    const newDate = date ? new Date(date + 'T00:00:00') : new Date()

    const newLog = {
      description,
      duration: parseInt(duration),
      date: newDate.toDateString(),
    }

    user.count += 1
    user.log.push(newLog)

    await user.save()

    const newExercise = {
      username: user.username,
      description,
      duration: parseInt(duration),
      date: newDate.toDateString(),
      _id: user._id,
    }

    return res.json(newExercise)
  } catch {
    return res.status(500).json({ error: 'Failed to save exercise' })
  }
}

export const addUser = async (req, res) => {
  // Add new user and returns the new user added. If user already exists returns that user
  if (!req.body.username)
    return res.status(400).json({ error: 'Username required' })

  const validation = validateUser({ username: req.body.username })

  if (!validation.success)
    return res.status(400).json({ error: 'Invalid user' })

  const { username } = validation.data

  try {
    const user = await UserModel.findOne({ username: username }).select(
      'username _id'
    )

    if (user) return res.json(user)

    const newLog = {
      username: username,
      count: 0,
      log: [],
    }

    const createdUser = await UserModel.create(newLog)

    return res.json({
      username: createdUser.username,
      _id: createdUser._id,
    })
  } catch {
    res.status(500).json({ error: 'Failed to create user' })
  }
}

export const getLogs = async (req, res) => {
  // Get the logs from an existing user. If user doesn't exist returns error. {from, to, limit} optional queries
  const { id } = req.params
  const validation = validateQuery(req.query)

  if (!validation.success)
    return res.status(400).json({ error: 'Invalid query' })

  const { from, to, limit } = validation.data

  try {
    const user = await UserModel.findOne({ _id: id })
    if (!user) return res.status(404).json({ error: 'User not found' })

    if (!from && !to && !limit) {
      return res.json(user.toObject())
    }

    const fromData = from ? new Date(from) : new Date(0)
    const toData = to ? new Date(to) : new Date()
    const limitData = limit ? parseInt(limit) : 0

    const filteredLogs = user.log
      .filter((log) => {
        const logDate = new Date(log.date)
        return logDate >= fromData && logDate <= toData
      })
      .slice(0, limitData === 0 ? user.log.length : limitData)

    return res.json({
      ...user.toObject(),
      count: filteredLogs.length,
      log: filteredLogs,
    })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch logs' })
  }
}
