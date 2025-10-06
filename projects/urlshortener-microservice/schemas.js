const z = require('zod')

const Url = z.url()

const validateUrl = (url) => {
  const result = Url.safeParse(url)

  if (result.success) return true
  return false
}

module.exports = validateUrl
