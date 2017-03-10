'use strict'
const _ = require('lodash')

module.exports = class VirtualCreditCard {
  constructor (data) {
    this.id = _.get(data, 'ID')
    this.number = _.get(data, 'NUM')
    this.expirationDate = _.get(data, 'EDATE')
    this.cvx = _.get(data, 'CVX')
  }
}
