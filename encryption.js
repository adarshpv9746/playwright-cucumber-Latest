const CryptoJS = require('crypto-js')
// Encrypt the userName and Password with Secret Key
const encryptValue = CryptoJS.AES.encrypt(
  'Type the value to Encrypt',
  'Type the secret Key'
).toString()
// Please Update the below encrypted username and password in Config File(tst.json file)
console.log('Encypted UserName:' + encryptValue)
