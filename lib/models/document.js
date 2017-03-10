'use strict'

const _ = require('lodash')
const moment = require('moment')

module.exports = class Document {
  constructor (data) {
    this.id = _.get(data, 'ID')
    this.status = _.get(data, 'S')
    this.type = _.get(data, 'TYPE')
    this.comment = _.get(data, 'C')
    if (_.get(data, 'VD')) {
      this.validityDate = moment(_.get(data, 'VD'), 'dd/mm/yyyy').toDate()
    }
  }
}
