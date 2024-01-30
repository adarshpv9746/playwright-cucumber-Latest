/**
 * Func to decrypt a data
 * @param {string} encryptedValue
 * @returns {string}
 */
function base64Decryption (encryptedValue) {
  const buff = Buffer.from(encryptedValue, 'base64')
  const decryptedValue = buff.toString('ascii')
  return decryptedValue
}

module.exports = { base64Decryption }
