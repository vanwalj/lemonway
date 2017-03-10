// @flow
'use strict'
const moment = require('moment')

module.exports = class Document {
  constructor ({ ID, S, TYPE, C, VD }) {
    this.id = ID
    this.status = S
    this.type = TYPE
    this.comment = C
    if (VD) {
      this.validityDate = moment(VD, 'dd/mm/yyyy').toDate()
    }
  }
}
