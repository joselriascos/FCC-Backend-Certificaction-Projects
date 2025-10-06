const path = require('path')

const validateUrl = require('../../schemas.js')
const { STATUS } = require('../../utils/consts.js')

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

    let result = {
      status: '',
      object: {},
    }

    if (!validUrl)
      return (result = {
        status: STATUS.INVALID_URL,
        object: {},
      })

    const savedUrl = URLS.find((item) => item.original_url === url)

    if (savedUrl)
      return (result = {
        status: STATUS.URL_ALREADY_SAVED,
        object: savedUrl,
      })

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

    return (result = {
      status: STATUS.URL_CREATED,
      object: newUrl,
    })
  }
}

module.exports = UrlModel
