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

module.exports = generateRandomString
