// @flow
'use strict'
const Client = require('./client')
const WalletFactory = require('./factories/wallet-factory')
const TransactionFactory = require('./factories/transaction-factory')
const MoneyInWebFactory = require('./factories/money-in-web-factory')
const SDDMandateFactory = require('./factories/sdd-mandate-factory')

class Lemonway {
  constructor (
    login/*: string */, pass/*: string */, endpoint/*: string */,
    webKitUrl/*: string */, options/*: any */
  ) {
    this._login = login
    this._pass = pass
    this._endpoint = endpoint
    this._webKitUrl = webKitUrl
    this._client = new Client(login, pass, endpoint, options)

    this.errors = Lemonway.errors
    this.constants = Lemonway.constants

    this.Wallet = new WalletFactory(this)
    this.Transaction = new TransactionFactory(this)
    this.MoneyInWeb = new MoneyInWebFactory(this)
    this.SDDMandate = new SDDMandateFactory(this)
  }
}

Lemonway.constants = require('./constants')
Lemonway.errors = require('./errors')

module.exports = Lemonway
