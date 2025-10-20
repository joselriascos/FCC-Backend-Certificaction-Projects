import multer from 'multer'
import path from 'path'

// multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

// multer middleware with config
const upload = multer({ storage: storage })

export default upload
