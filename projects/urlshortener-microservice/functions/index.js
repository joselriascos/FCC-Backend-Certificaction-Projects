const express = require('express')
const cors = require('cors')
const path = require('path')

const validateUrl = require('../schemas')

const app = express()
const PORT = process.env.PORT || 3000

const URLS = require(path.join(
  __dirname,
  '..',
  'database',
  'local',
  'urls.json'
))

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

app.get('/api/shorturl/:shorturl', (req, res) => {
  const { shorturl } = req.params

  const url = URLS.find((item) => item.short_url === parseInt(shorturl))

  if (!url) return res.json({ error: 'No short URL found for the given input' })

  res.redirect(url.original_url)
})

app.post('/api/shorturl/', (req, res) => {
  let { url } = req.body

  const validUrl = validateUrl(url)

  if (!validUrl) return res.json({ error: 'invalid url' })

  const savedUrl = URLS.find((item) => item.original_url === url)

  if (savedUrl) return res.json(savedUrl)

  url = decodeURIComponent(url).toLowerCase()
  const newShortUrl =
    URLS.reduce((max = 1, item) => {
      const { short_url } = item
      return short_url > max ? short_url : max
    }, 1) + 1

  const newUrl = {
    original_url: url,
    short_url: newShortUrl,
  }

  URLS.push(newUrl)

  res.json(newUrl)
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
