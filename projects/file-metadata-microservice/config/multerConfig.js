const multer = require('multer')


// multer config
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/')
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname))
//   },
// })

const storage = multer.memoryStorage()

// multer middleware with config
const upload = multer({ storage: storage })

module.exports = upload
