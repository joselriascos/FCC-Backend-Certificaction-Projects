const mongoose = require('mongoose')

const validateUrl = require('../../schemas.js')

const urlSchema = new mongoose.Schema(
  {
    original_url: {
      type: String,
      required: true,
      unique: true,
    },
    short_url: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { versionKey: false, collection: 'URLs' }
)

urlSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // delete returnedObject.__v
  },
})

urlSchema.statics.searchUrl = async function ({ shorturl }) {
  const url = await this.findOne({ short_url: shorturl })
  if (!url) return false
  return url
}

urlSchema.statics.createUrl = async function ({ url }) {
  const validUrl = validateUrl(url)
  if (!validUrl) return false

  const decodedUrl = decodeURIComponent(url).toLowerCase()
  const savedUrl = await this.findOne({
    original_url: decodedUrl,
  })
  if (savedUrl) return savedUrl

  const last = await this.findOne().sort({ short_url: -1 }).limit(1)
  const newShortUrl = last ? last.short_url + 1 : 1

  const newUrl = await new this({
    original_url: decodedUrl,
    short_url: newShortUrl,
  })

  await newUrl.save()

  return newUrl
}

const UrlModel = mongoose.model('Url', urlSchema)
module.exports = UrlModel
