export const uploadFile = (req, res) => {
  const { file } = req

  if (!file) return res.status(400).json('No file uploaded')

  res.json({
    name: file.filename,
    type: file.mimetype,
    size: file.size,
  })
}
