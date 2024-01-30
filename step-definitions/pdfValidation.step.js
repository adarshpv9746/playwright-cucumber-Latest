const { Then } = require('@cucumber/cucumber')
const { obInit } = require('../setup/init')

Then('User validates the data in a sample PDF', async function () {
  this.po = obInit()
  this.PDFData = this.po.getPDFDetails()
  const extractedData = await this.PDFData.parseStatement()
  global
    .expect(extractedData.accNumValue.toString().trim())
    .to.equal('65656565656')
})
