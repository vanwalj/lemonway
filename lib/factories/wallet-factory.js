'use strict'
const _ = require('lodash')

const Acs = require('../models/acs')
const Card = require('../models/card')
const SDDMandate = require('../models/sdd-mandate')
const IBAN = require('../models/IBAN')
const VirtualCreditCard = require('../models/virtual-credit-card')
const Document = require('../models/document')

function WalletFactory (lemonway) {
  const factory = this

  this.Wallet = function Wallet (data) {
    this.id = _.get(data, 'ID')
    this.lemonWayId = _.get(data, 'LWID')
    this.balance = parseFloat(_.get(data, 'BAL', 0))
    this.name = _.get(data, 'NAME')
    this.email = _.get(data, 'EMAIL')
    this.status = _.get(data, 'STATUS') || _.get(data, 'S')
    this.blocked = _.get(data, 'BLOCKED')
    this.method = _.get(data, 'METHOD')
    if (_.get(data, 'DOCS')) {
      this.documents = _.map(_.get(data, 'DOCS.DOC', _.get(data, 'DOCS')), (doc) => new Document(doc.DOC ? doc.DOC : doc))
    }
    if (_.get(data, 'IBANS')) {
      this.ibans = _.map(_.get(data, 'IBANS.IBAN', _.get(data, 'IBANS')), (iban) => new IBAN(iban))
    }
    if (_.get(data, 'SDDMANDATES')) {
      this.sddMandates = _.map(_.get(data, 'SDDMANDATES.SDDMANDATE'), (sddMandate) => new SDDMandate(sddMandate))
    }
  }

  this.create =
  this.register =
  this.registerWallet = (ip, opts = {}) =>
    lemonway._client.registerWallet(ip, opts)
      .then((data) => new this.Wallet(data))

  this.list =
  this.getBalances = (ip, opts = {}) =>
    lemonway._client.getBalances(ip, opts)
      .map((data) => new this.Wallet(data))

  this.get =
  this.getWalletDetails = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id'),
      email: _.get(wallet, 'email')
    })

    if (!opts.wallet && !opts.email) {
      opts.wallet = wallet
    }

    return lemonway._client.getWalletDetails(ip, opts)
      .then((data) => ({
        wallet: new this.Wallet(data),
        documents: _.map(_.get(data, 'DOCS', []), (data) => new Document(data)),
        creditCards: _.map(_.get(data, 'CARDS.CARD', []), (data) => new Card(data))
      }))
  }

  this.listKyc =
  this.getKycStatus = (ip, opts) =>
    lemonway._client.getKycStatus(ip, opts)
      .get('WALLET')
      .map((data) => ({
        wallet: new this.Wallet(data),
        documents: _.map(_.get(data, 'DOCS', []), (data) => new Document(data)),
        ibans: _.map(_.get(data, 'IBANS', []), (data) => new IBAN(data))
      }))

  this.update = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      ip: _opts.ip || lemonway._ip,
      id: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.UpdateWalletDetails(ip, opts)
      .then((data) => new this.Wallet(data))
  }

  this.moneyIn = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.moneyIn(ip, opts)
      .then((data) => new lemonway.Transaction.Transaction(data))
  }

  this.moneyInWebInit = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.moneyInWebInit(ip, opts)
      .then((data) => new lemonway.MoneyInWeb.MoneyInWeb(data))
  }

  this.moneyIn3DInit = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.moneyIn3DInit(ip, opts)
      .then((data) => ({
        acs: new Acs(data.acs),
        transaction: new lemonway.Transaction.Transaction(data.transaction)
      }))
  }

  this.registerCard = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.registerCard(ip, opts)
      .then((data) => new Card(data))
  }

  this.unregisterCard = (ip, wallet, card, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet,
      cardId: card.id ? card.id : card
    })

    return lemonway._client.unregisterCard(ip, opts)
      .then((data) => new Card(data))
  }

  this.moneyInWithCard = (ip, wallet, card, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet,
      cardId: card.id ? card.id : card
    })

    return lemonway._client.moneyInWithCardId(ip, opts)
      .then((data) => new lemonway.Transaction.Transaction(data))
  }

  this.registerSDDMandate = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.registerSDDMandate(ip, opts)
      .then((data) => new lemonway.SDDMandate.SDDMandate(data))
  }

  this.unregisterSDDMandate = (ip, wallet, mandate, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet,
      sddMandateId: _.get(mandate, 'id', mandate)
    })

    return lemonway._client.unregisterSDDMandate(ip, opts)
      .then((data) => new SDDMandate(data))
  }

  this.updateWalletStatus = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    })

    return lemonway._client.updateWalletStatus(ip, opts)
      .then((data) => new this.Wallet(data))
  }

  this.moneyInSDDInit = (ip, wallet, mandate, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet),
      sddMandateId: _.get(mandate, 'id', mandate)
    })

    return lemonway._client.moneyInSDDInit(ip, opts)
      .then((data) => new lemonway.Transaction.Transaction(data))
  }

  this.moneyInChequeInit = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet)
    })

    return lemonway._client.moneyInChequeInit(ip, opts)
      .then((data) => new lemonway.Transaction.Transaction(data))
  }

  this.registerIBAN = (ip, wallet, _opts) => {
    const opts = _.assign({
      wallet: _.get(wallet, 'id', wallet)
    }, _opts)

    return lemonway._client.registerIBAN(ip, opts)
      .then((data) => new IBAN(data))
  }

  this.moneyOut = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet),
      ibanId: _.get(_opts, 'iban.id', _.get(_opts, 'iban'))
    })

    return lemonway._client.moneyOut(ip, opts)
      .then((data) => new lemonway.Transaction.Transaction(data))
  }

  this.transfer =
    this.sendPayment = (ip, fromWallet, toWallet, _opts) => {
      const opts = _.assign({}, _opts, {
        debitWallet: _.get(fromWallet, 'id', fromWallet),
        creditWallet: _.get(toWallet, 'id', toWallet)
      })

      return lemonway._client.sendPayment(ip, opts)
        .then((data) => new lemonway.Transaction.Transaction(data))
    }

  this.createVCC = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      debitWallet: _.get(wallet, 'id', wallet)
    })

    return lemonway._client.createVCC(ip, opts)
      .then((data) => ({
        transaction: new lemonway.Transaction.Transaction(data),
        virtualCreditCard: new VirtualCreditCard(_.get(data, 'VCC'))
      }))
  }

  this.uploadFile = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet)
    })

    return lemonway._client.uploadFile(ip, opts)
      .then((data) => new Document(data))
  }

  this.getWalletTransHistory = (ip, wallet, _opts) => {
    const opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet)
    })

    return lemonway._client.getWalletTransHistory(ip, opts)
      .map((data) => new lemonway.Transaction.Transaction(data))
  }

  const instanceMethods = {
    'update': ['update'],
    'moneyIn': ['moneyIn'],
    'moneyInWebInit': ['moneyInWebInit'],
    'moneyIn3DInit': ['moneyIn3DInit'],
    'registerCard': ['registerCard'],
    'unregisterCard': ['unregisterCard'],
    'moneyInWithCard': ['moneyInWithCard'],
    'registerSDDMandate': ['registerSDDMandate'],
    'unregisterSDDMandate': ['unregisterSDDMandate'],
    'updateWalletStatus': ['updateWalletStatus', 'updateStatus'],
    'moneyInSDDInit': ['moneyInSDDInit'],
    'moneyInChequeInit': ['moneyInChequeInit'],
    'registerIBAN': ['registerIBAN'],
    'moneyOut': ['moneyOut'],
    'sendPayment': ['sendPayment', 'transfer'],
    'createVCC': ['createVCC', 'createVirtualCreditCard'],
    'uploadFile': ['uploadFile'],
    'getWalletTransHistory': ['getWalletTransHistory', 'getTransactions']
  }

  _.each(instanceMethods, (aliases, method) => {
    _.each(aliases, (alias) => {
      factory.Wallet.prototype[alias] = (ip) => {
        const _arguments = _.toArray(arguments).splice(1)
        return factory[method](...[ip, this].concat(_arguments))
      }
    })
  })
}

module.exports = WalletFactory
