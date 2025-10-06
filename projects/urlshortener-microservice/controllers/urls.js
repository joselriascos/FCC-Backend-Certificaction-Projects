const path = require('path')

const UrlModel = require('../models/local/url')
const { STATUS } = require('../utils/consts')

class UrlController {
  static async landingPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
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

    if (result.status === STATUS.INVALID_URL)
      return res.json({ error: STATUS.INVALID_URL })

    if (result.status === STATUS.URL_ALREADY_SAVED)
      return res.json(result.object)

    if (result.status === STATUS.URL_CREATED) return res.json(result.object)
  }
}

module.exports = UrlController
