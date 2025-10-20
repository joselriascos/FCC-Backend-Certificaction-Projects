const express = require('express')
const path = require('path')
const upload = require('../config/multerConfig.js')
const { uploadFile } = require('../controllers/fileController.js')

const fileRouter = express.Router()

fileRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
  console.log(__dirname)
})

fileRouter.post('/upload', upload.single('upfile'), uploadFile)

module.exports = fileRouter
