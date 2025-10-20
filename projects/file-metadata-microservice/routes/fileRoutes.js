import express from 'express'
import path from 'path'
import upload from '../config/multerConfig.js'
import { uploadFile } from '../controllers/fileController.js'

const fileRouter = express.Router()

const __dirname = process.cwd()

fileRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

fileRouter.post('/upload', upload.single('upfile'), uploadFile)

export default fileRouter
