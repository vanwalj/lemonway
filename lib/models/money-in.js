'use strict'
const _ = require('lodash')

module.exports = class MoneyIn {
  constructor (data) {
    this.O3DCode = _.get(data, 'O3D_CODE')
  }
}
