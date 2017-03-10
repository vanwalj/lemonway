'use strict'
const _ = require('lodash')

module.exports = class SDDMandate {
  constructor (data) {
    this.id = _.get(data, 'ID')
    this.status = _.get(data, 'S')
    this.iban = _.get(data, 'DATA')
    this.swift = _.get(data, 'SWIFT')
  }
}
