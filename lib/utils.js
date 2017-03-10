// @flow
'use strict'

const _ = require('lodash')
const moment = require('moment')
const creditCardType = require('credit-card-type')
const constants = require('./constants')

const remap = (object, map) => _.reduce(object, (result, n, key) => {
  result[map[key] ? map[key] : key] = n
  return result
}, {})

const numberToFixed = (val/*: any */, fixed/*: number */ = 2) => typeof val !== 'number' ? val : val.toFixed(fixed || 2)

const dateToUnix = (val/*: any */) => val instanceof Date ? moment(val).unix() : val

const dateToDayString = (val/*: any */) => val instanceof Date ? moment(val).format('DD/MM/YYYY') : val

const boolToString = (val/*: any */) => typeof val !== 'boolean' ? val : val ? '1' : '0'

const stringToInteger = (val/*: any */) => typeof val === 'string' ? parseInt(val, 10) : val

const cardNumberToType = (cardNumber/*: string */) => {
  const cardType = creditCardType(cardNumber)
  if (cardType.type && cardType.type[0] === 'visa') {
    return constants.CARD_TYPE.VISA
  }
  if (cardType.type && cardType.type[0] === 'master-card') {
    return constants.CARD_TYPE.MASTERCARD
  }
  return constants.CARD_TYPE.CB
}

const getIp = (req/*: any */) => _.get(req, 'ip', req)

module.exports = {
  remap: remap,
  numberToFixed: numberToFixed,
  dateToUnix: dateToUnix,
  dateToDayString: dateToDayString,
  boolToString: boolToString,
  stringToInteger: stringToInteger,
  cardNumberToType: cardNumberToType,
  getIp: getIp
}
