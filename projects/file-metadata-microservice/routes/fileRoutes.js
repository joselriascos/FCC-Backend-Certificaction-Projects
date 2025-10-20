import express from 'express'
import path from 'path'
import upload from '../config/multerConfig.js'
import { uploadFile } from '../controllers/fileController.js'
import { fileURLToPath } from 'url'

const fileRouter = express.Router()

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

fileRouter.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
  res.json({ message: 'Hello World' })
})

fileRouter.post('/upload', upload.single('upfile'), uploadFile)

export default fileRouter
