import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import fileRouter from '../routes/fileRoutes.js'

dotenv.config()

const app = express()

const port = process.env.PORT || 0

app.use(cors())
app.use(express.json())

app.use("/", fileRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
