// init project
const express = require('express')
const app = express()

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
const cors = require('cors')
app.use(cors({ optionsSuccessStatus: 200 })) // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html')
})

// ENDPOINTS
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' })
})

app.get('/api/{:date}', (req, res) => {
  const { date } = req.params

  let time = {
    unix: undefined,
    utc: undefined,
  }

  if (!date) {
    time.unix = Date.now()
    time.utc = new Date(time.unix).toUTCString()
    return res.json(time)
  }

  if (isNaN(Number(date))) {
    const parsedDate = new Date(date)
    if (parsedDate.toString() === 'Invalid Date') {
      return res.json({ error: 'Invalid Date' })
    }
    time.unix = parsedDate.getTime()
    time.utc = parsedDate.toUTCString()
    return res.json(time)
  }

  if (Number(date) < 0) return res.json({ error: 'Invalid Date' })

  time.unix = Number(date)
  time.utc = new Date(time.unix).toUTCString()
  return res.json(time)
})

app.use((req, res) => res.json({ error: 'Invalid Route' }))

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})
