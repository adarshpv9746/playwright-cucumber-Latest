const { cryptoJSDecryption } = require('../utils/cryptoJSDecrypt')
const config = require('config')
const SECRET_KEY = process.env.SECRET_KEY
class PdfValidation {
  async parseStatement () {
    const { PdfReader } = await import('pdfreader')
    return new Promise((resolve, reject) => {
      const pdfPath = process.cwd() + '/datainput/Statements.pdf'
      const pdfPassword = config.get('app.pdfpassword')
      const pwd = cryptoJSDecryption(pdfPassword, SECRET_KEY)

      let isAccNumLabelExists = false
      let accNumValue = ''

      new PdfReader({ password: pwd }).parseFileItems(
        pdfPath,
        function (err, item) {
          if (err) {
            reject(err)
          } else if (!item) {
            const result = { accNumValue }

            resolve(result)
            // To remove the PDF Statement after validation
            // fs.unlinkSync(pdfPath);
          } else if (item.text) {
            if (isAccNumLabelExists) {
              accNumValue = item.text
              isAccNumLabelExists = false
            }
            if (item.text.includes('number')) {
              isAccNumLabelExists = true
            }
          }
        }
      )
    })
  }
}

module.exports = { PdfValidation }
