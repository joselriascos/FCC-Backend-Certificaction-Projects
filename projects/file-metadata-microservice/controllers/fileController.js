const uploadFile = (req, res) => {
  const { file } = req

  if (!file) return res.status(400).json('No file uploaded')

  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  })
}

module.exports = { uploadFile }
