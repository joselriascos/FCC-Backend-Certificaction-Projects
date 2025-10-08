const z = require('zod')

const Url = z.url()

const validateUrl = (url) => {
  const isZodVaild = Url.safeParse(url)
  const followsFCCFormat = /^https?:\/\/(www\.)?.+\..+/.test(url)

  if (!isZodVaild.success || !followsFCCFormat) return false
  return true
}

module.exports = validateUrl
