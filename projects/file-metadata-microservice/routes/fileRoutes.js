import express from 'express'
import path from 'path'
import upload from '../config/multerConfig.js'
import { uploadFile } from '../controllers/fileController.js'
import { fileURLToPath } from 'url'

const fileRouter = express.Router()

const __filename = fileURLToPath(import.meta.url)

fileRouter.get('/', (req, res) => {
  res.sendFile(path.join(__filename, '..', '..', 'views', 'index.html'))
  console.log(fileURLToPath(import.meta.url))
})

fileRouter.post('/upload', upload.single('upfile'), uploadFile)

export default fileRouter
