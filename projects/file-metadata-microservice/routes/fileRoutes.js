import express from 'express'
import upload from '../config/multerConfig.js'
import { uploadFile } from '../controllers/fileController.js'

const fileRouter = express.Router()

fileRouter.post('/upload', upload.single('upfile'), uploadFile)

export default fileRouter
