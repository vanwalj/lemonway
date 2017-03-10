// @flow
'use strict'
const _ = require('lodash')
const MoneyIn = require('../models/money-in')
const errors = require('../errors')
const moment = require('moment')

function TransactionFactory (lemonway) {
  const factory = this

  this.Transaction = function Transaction (data) {
    this.id = _.get(data, 'ID')
    this.cardAlias = this.iban = _.get(data, 'MLABEL')
    this.date = _.get(data, 'DATE') ? moment(_.get(data, 'DATE'), 'DD/MM/YYYY hh:mm:ss').toDate() : undefined
    this.debitedWalletId = _.get(data, 'SEN')
    this.creditedWalletId = _.get(data, 'REC')
    this.debited = parseFloat(_.get(data, 'DEB'))
    this.credited = parseFloat(_.get(data, 'CRED'))
    this.amount = this.debited || this.credited
    this.commission = parseFloat(_.get(data, 'COM'))
    this.comment = _.get(data, 'MSG')
    this.status = _.get(data, 'STATUS')
    this.isCard = !!_.get(data, 'EXTRA')
    this.is3DS = _.get(data, 'EXTRA.IS3DS') === '1'
    this.cardCountry = _.get(data, 'EXTRA.CTRY')
    this.authorizationNumber = _.get(data, 'EXTRA.AUTH')
    this.scheduledDate = _.get(data, 'SCHEDULED_DATE') ? moment(_.get(data, 'SCHEDULED_DATE'), 'YYYY/MM/DD').toDate() : undefined
    this.privateData = _.get(data, 'PRIVATE_DATA') ? _.get(data, 'PRIVATE_DATA').split(';') : undefined
    this.ibanId = _.get(data, 'MID')
    this.method = _.get(data, 'METHOD')
    this.type = _.get(data, 'TYPE')
  }

  const instanceMethods = {
    'moneyIn3DConfirm': ['moneyIn3DConfirm'],
    'moneyIn3DAuthenticate': ['moneyIn3DAuthenticate'],
    'moneyInValidate': ['moneyInValidate'],
    'refundMoneyIn': ['refundMoneyIn']
  }

  _.each(instanceMethods, (aliases, method) => {
    _.each(aliases, (alias) => {
      factory.Transaction.prototype[alias] = (ip) => {
        const _arguments = _.toArray(arguments).splice(1)
        return factory[method](...[ip, this].concat(_arguments))
      }
    })
  })

  this.moneyIn3DConfirm = (ip, transaction, _opts) => {
    const opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts)

    return lemonway._client.moneyIn3DConfirm(ip, opts)
      .then((data) => new this.Transaction(data))
  }

  this.moneyIn3DAuthenticate = (ip, transaction, _opts) => {
    const opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts)

    return lemonway._client.moneyIn3DAuthenticate(ip, opts)
      .then((data) => new MoneyIn(data))
  }

  this.moneyInValidate = (ip, transaction, _opts) => {
    const opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts)

    return lemonway._client.moneyInValidate(ip, opts)
      .then((data) => new this.Transaction(data))
  }

  this.refundMoneyIn = (ip, transaction, _opts) => {
    const opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts)

    return lemonway._client.refundMoneyIn(ip, opts)
      .then((data) => new this.Transaction(data))
  }

  this.getMoneyInIBANDetails = (ip, _opts) => {
    const opts = _.assign({
      after: _opts.after || 0
    }, _opts)

    return lemonway._client.getMoneyInIBANDetails(ip, opts)
      .catch(errors.TransactionNotFound, () => [])
      .map((data) => new this.Transaction(data))
  }

  this.getMoneyInSDD = (ip, _opts) => {
    const opts = _.assign({
      after: _opts.after || 0
    }, _opts)

    return lemonway._client.getMoneyInSDD(ip, opts)
      .catch(errors.TransactionNotFound, () => [])
      .map((data) => new this.Transaction(data))
  }

  this.getMoneyInChequeDetails = (ip, _opts) => {
    const opts = _.assign({
      after: _opts.after || 0
    }, _opts)

    return lemonway._client.getMoneyInChequeDetails(ip, opts)
      .catch(errors.TransactionNotFound, () => [])
      .map((data) => new this.Transaction(data))
  }

  this.getMoneyInTransDetails =
    this.list =
      this.listMoneyIn = (ip, _opts) => {
        const opts = _.assign({}, _opts)

        return lemonway._client.getMoneyInTransDetails(ip, opts)
          .catch(errors.TransactionNotFound, () => [])
          .map((data) => new this.Transaction(data))
      }

  this.getMoneyOutTransDetails =
  this.listMoneyOut = (ip, _opts) => {
    const opts = _.assign({}, _opts)

    return lemonway._client.getMoneyOutTransDetails(ip, opts)
      .catch(errors.TransactionNotFound, () => [])
      .map((data) => new this.Transaction(data))
  }

  this.getPaymentDetails =
  this.listTransfer = (ip, _opts) => {
    const opts = _.assign({}, _opts)

    return lemonway._client.getPaymentDetails(ip, opts)
      .catch(errors.TransactionNotFound, () => [])
      .map((data) => new this.Transaction(data))
  }

  this.getChargebacks = (ip, _opts) => {
    const opts = _.assign({}, _opts)

    return lemonway._client.getChargebacks(ip, opts)
      .catch(errors.TransactionNotFound, () => [])
      .map((data) => new this.Transaction(data))
  }

  this.get =
  this.getMoneyIn = (ip, transaction) => {
    const opts = {
      transactionId: _.get(transaction, 'id', transaction)
    }

    if (!opts.transactionId) return this.list()

    return lemonway._client.getMoneyInTransDetails(ip, opts)
      .then(_.head)
      .then((data) => !data ? data : new this.Transaction(data))
  }

  this.getMoneyOut = (ip, transaction) => {
    const opts = {
      transactionId: _.get(transaction, 'id', transaction)
    }

    return lemonway._client.getMoneyOutTransDetails(ip, opts)
      .then((data) => _.get(data, '[0]'))
      .then((data) => !data ? data : new this.Transaction(data))
  }

  this.getTransfer = (ip, transaction) => {
    const opts = {
      transactionId: _.get(transaction, 'id', transaction)
    }

    return lemonway._client.getPaymentDetails(ip, opts)
      .then((data) => _.get(data, '[0]'))
      .then((data) => !data ? data : new this.Transaction(data))
  }
}

module.exports = TransactionFactory
