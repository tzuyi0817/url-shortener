const Url = require('./models/url')

function generateRandomString() {
  const length = 5
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let url = ''

  for (var i = 0; i < length; i++) {
    const n = charset.length
    url += charset.charAt(Math.floor(Math.random() * n))
  }
  return url
}

const check = shorten => {
  Url.findOne({ shortenUrl: shorten }).then(url => {
    if (url) {
      return false
    } else {
      return true
    }
  })
    .catch(err => console.log(err))
}

const shortenUrl = url => {
  const shorten = generateRandomString()
  const checkUrl = check(shorten)

  if (checkUrl === false) {
    shortenUrl(url)
  } else {
    return shorten
  }
}


module.exports = shortenUrl
