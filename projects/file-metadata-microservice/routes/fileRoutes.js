const express = require('express')
const upload = require('../config/multerConfig.js')
const { uploadFile } = require('../controllers/fileController.js')
const path = require('path')

const fileRouter = express.Router()

fileRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

fileRouter.post('/api/fileanalyse', upload.single('upfile'), uploadFile)

module.exports = fileRouter
