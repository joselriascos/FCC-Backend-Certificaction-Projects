const path = require('path')

const validateUrl = require('../../schemas.js')

const URLS = require(path.join(
  __dirname,
  '..',
  '..',
  'database',
  'local',
  'urls.json'
))

class UrlModel {
  static async searchUrl({ shorturl }) {
    const url = URLS.find((item) => item.short_url === parseInt(shorturl))
    if (!url) return false
    return url
  }

  static async createUrl({ url }) {
    const validUrl = validateUrl(url)

    if (!validUrl) return false

    const savedUrl = URLS.find((item) => item.original_url === url)

    if (savedUrl) return savedUrl

    const decodedUrl = decodeURIComponent(url).toLowerCase()

    const newShortUrl =
      URLS.reduce((max = 1, item) => {
        const { short_url } = item
        return short_url > max ? short_url : max
      }, 1) + 1

    const newUrl = {
      original_url: decodedUrl,
      short_url: newShortUrl,
    }

    URLS.push(newUrl)

    return newUrl
  }
}

module.exports = UrlModel
