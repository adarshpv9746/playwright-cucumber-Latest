const { HomePage } = require('./HomePage')
const { ItemDetails } = require('./ItemDetailsPage')
const { PdfValidation } = require('../helper/PdfValidation')

class ObjectHandler {
  constructor (page) {
    this.page = page
    this.homePage = new HomePage(this.page)
    this.itemDetails = new ItemDetails(this.page)
    this.pdfValidation = new PdfValidation(this.page)
  }

  homePageInit () {
    return this.homePage
  }

  getItemDetails () {
    return this.itemDetails
  }

  getPDFDetails () {
    return this.pdfValidation
  }
}

module.exports = ObjectHandler
