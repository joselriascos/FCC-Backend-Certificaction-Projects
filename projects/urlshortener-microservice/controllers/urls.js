const path = require('path')

const UrlModel = require('../models/mongoDB/url.js')

class UrlController {
  static async landingPage(req, res) {
    res.sendFile(path.join(process.cwd(), 'views', 'index.html'))
  }

  static async redirectToUrl(req, res) {
    const { shorturl } = req.params
    const url = await UrlModel.searchUrl({ shorturl })
    if (!url)
      return res.json({ error: 'No short URL found for the given input' })
    res.redirect(url.original_url)
  }

  static async createUrl(req, res) {
    const { url } = req.body
    const result = await UrlModel.createUrl({ url })

    if (!result) return res.json({ error: 'invalid url' })

    return res.json(result)
  }
}

module.exports = UrlController
