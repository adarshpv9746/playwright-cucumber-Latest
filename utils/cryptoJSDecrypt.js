const CryptoJS = require('crypto-js')
function cryptoJSDecryption (encryptedValue, secretKey) {
  try {
    const decryptedValue = CryptoJS.AES.decrypt(
      encryptedValue,
      secretKey
    ).toString(CryptoJS.enc.Utf8)
    return decryptedValue
  } catch (err) {
    return null
  }
}
module.exports = { cryptoJSDecryption }
