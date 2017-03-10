// @flow
'use strict'

const assert = require('assert')
const fs = require('fs')
const url = require('url')

const _ = require('lodash')
const Promise = require('bluebird')
const soap = require('soap')

const utils = require('./utils')
const validator = require('./validator')
const validationSchemas = require('./validation-schemas')
const errors = require('./errors')
const constants = require('./constants')
const ProxyHttpClient = require('./proxyHttpClient')

const config = require('./config')

const _createSoapClient = Promise.promisify(soap.createClient, { context: soap })

const methods = {}

module.exports = class Client {
  constructor (login, pass, endpoint, options) {
    assert(login, 'Lemonway login not set')
    assert(pass, 'Lemonway pass not set')
    assert(endpoint, 'Lemonway endpoint not set')

    this._login = login
    this._pass = pass
    this.options = options || {}

    // A proxy URL can be provided to support the IP security
    if (this.options.proxy) {
      const sourceEndpointUri = url.parse(endpoint)
      const sourceEndpointHost = `${sourceEndpointUri.protocol}//${sourceEndpointUri.host}`

      this._endpoint = endpoint.replace(sourceEndpointHost, this.options.proxy)
      this.options.httpClient = new ProxyHttpClient(sourceEndpointHost, this.options.proxy)
    } else {
      this._endpoint = endpoint
    }
  }

  _handleError (code, message) {
    const ErrorClass = _.find(errors, (error) => _.includes(error.codes, code))

    if (ErrorClass) {
      throw new ErrorClass(code)
    }

    throw new errors.LemonwayError(code, message)
  }

  setWalletIp (ip) {
    this._ip = ip
  }

  setWalletUserAgent (ua) {
    this._userAgent = ua
  }

  _request (method, ip, args, resultName) {
    const _arguments = arguments

    if (!this._client) {
      return _createSoapClient(this._endpoint, this.options)
        .then((client) => {
          this._client = client
        })
        .then(() => this._request(..._arguments))
    }
    assert(this._client.Service_mb_json[config.APIVersion][method], `Lemonway API has no method ${method}`)

    return new Promise((resolve) => {
      if (validationSchemas[method]) {
        return resolve(validator(args, validationSchemas[method]()))
      }
      return resolve(args)
    })
      .then((_args) => {
        let promise = _.get(methods, `${config.APIVersion}.${method}`)
        if (!promise) {
          promise = Promise.promisify(this._client.Service_mb_json[config.APIVersion][method], { context: this._client.Service_mb_json[config.APIVersion] })
          _.set(methods, `${config.APIVersion}.${method}`, promise)
        }
        return promise(_.omit(_.assign({
          wlLogin: this._login,
          wlPass: this._pass,
          walletIp: utils.getIp(ip)
        }, _args), _.isUndefined))
      })
      .get(resultName || `${method}Result`)
      .then((result) => {
        if (result.E) {
          return this._handleError(_.get(result, 'E.Code'), _.get(result, 'E.Msg'))
        }
        return result
      })
  }
  fastPay (ip, _opts) {
    const opts = Object.assign({}, _opts, {
      amount: typeof _opts === 'string' ? _opts : utils.numberToFixed(_opts.amount),
      version: '1.2'
    })

    return this._request('FastPay', ip, opts).get('TRANS').get('HPAY')
  }

  registerWallet (ip, _opts) {
    const opts = _.merge({
      version: '1.1'
    }, {
      wallet: _opts.id,
      clientMail: _opts.email,
      clientTitle: _opts.clientTitle,
      clientFirstName: _opts.firstName,
      clientLastName: _opts.lastName,
      street: _opts.street,
      postCode: _opts.postCode,
      city: _opts.city,
      ctry: _opts.country,
      phoneNumber: _opts.phoneNumber,
      mobileNumber: _opts.mobileNumber,
      birthdate: _opts.birthdate,
      isCompany: utils.boolToString(_opts.isCompany),
      companyName: _opts.companyName,
      companyWebsite: _opts.companyWebsite,
      companyDescription: _opts.companyDescription,
      companyIdentificationNumber: _opts.companyIdentificationNumber,
      isDebtor: utils.boolToString(_opts.isDebtor),
      nationality: _opts.nationality,
      birthcity: _opts.birthCity,
      birthcountry: _opts.birthCountry,
      payerOrBenificiary: utils.boolToString(_opts.payerOrBenificiary),
      isOneTimeCustomer: utils.boolToString(_opts.isOneTimeCustomer)
    })

    return this._request('RegisterWallet', ip, opts).get('WALLET')
  }

  UpdateWalletDetails (ip, _opts) {
    const opts = _.merge({}, {
      wallet: _opts.id,
      newEmail: _opts.email,
      newTitle: _opts.title,
      newFirstName: _opts.firstName,
      newLastName: _opts.lastName,
      newStreet: _opts.street,
      newPostCode: _opts.postCode,
      newCity: _opts.city,
      newCtry: _opts.country,
      newIp: _opts.ip,
      newPhoneNumber: _opts.phoneNumber,
      newMobileNumber: _opts.mobileNumber,
      newBirthdate: _opts.birthDate,
      newIsCompany: utils.boolToString(_opts.isCompany),
      newCompanyName: _opts.companyName,
      newCompanyWebsite: _opts.companyWebsite,
      newCompanyDescription: _opts.companyDescription,
      newCompanyIdentificationNumber: _opts.companyIdentificationNumber,
      newIsDebtor: utils.boolToString(_opts.isDebtor),
      newNationality: _opts.nationality,
      newBirthcity: _opts.birthCity,
      newBirthcountry: _opts.birthCountry
    })

    return this._request('UpdateWalletDetails', ip, opts, 'UpdateWalletStatusResult').get('WALLET')
  }

  updateWalletStatus (ip, _opts) {
    const opts = {
      wallet: _opts.wallet,
      newStatus: _.get(constants.WALLET_STATUS, _opts.status)
    }

    return this._request('UpdateWalletStatus', ip, opts).get('WALLET')
  }

  getWalletDetails (ip, _opts) {
    const opts = _.merge({
      version: '1.8'
    }, {
      email: _opts.email,
      wallet: _opts.wallet
    })

    return this._request('GetWalletDetails', ip, opts).get('WALLET')
  }

  moneyIn (ip, _opts) {
    const opts = Object.assign({}, _opts, {
      version: '1.1',
      amountTot: utils.numberToFixed(_opts.amount),
      autoCommission: utils.boolToString(_opts.autoCommission),
      isPreAuth: utils.boolToString(_opts.isPreAuth)
    })

    if (_opts.amountCom) {
      opts.amountCom = utils.numberToFixed(_opts.commission)
    }

    if (_opts.cardNumber) {
      opts.cardType = utils.cardNumberToType(_opts.cardNumber)
    }

    return this._request('MoneyIn', ip, opts).get('TRANS').get('HPAY')
  }

  moneyIn3DInit (ip, _opts) {
    const opts = Object.assign({}, _opts, {
      version: '1.1',
      cardCode: _opts.cardCrypto,
      amountTot: utils.numberToFixed(_opts.amount),
      amountCom: utils.numberToFixed(_opts.commission),
      autoCommission: utils.boolToString(_opts.autoCommission)
    })

    if (_opts.amountCom) {
      opts.amountCom = utils.numberToFixed(_opts.commission)
    }

    if (_opts.cardNumber) {
      opts.cardType = utils.cardNumberToType(_opts.cardNumber)
    }

    return this._request('MoneyIn3DInit', ip, opts)
      .get('MONEYIN3DINIT')
      .then((data) => ({
        acs: _.get(data, 'ACS'),
        transaction: _.get(data, 'TRANS.HPAY')
      }))
  }

  moneyIn3DConfirm (ip, _opts) {
    const opts = Object.assign({}, _opts, {
      version: '1.1',
      cardCode: _opts.cardCrypto,
      isPreAuth: utils.boolToString(_opts.isPreAuth)
    })

    return this._request('MoneyIn3DConfirm', ip, opts).get('MONEYIN3DCONFIRM').get('HPAY')
  }

  moneyInWebInit (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.3',
      amountTot: utils.numberToFixed(_opts.amount),
      amountCom: utils.numberToFixed(_opts.commission),
      useRegisteredCard: utils.boolToString(_opts.useRegisteredCard),
      autoCommission: utils.boolToString(_opts.autoCommission),
      registerCard: utils.boolToString(_opts.registerCard),
      wkToken: _opts.token
    })

    return this._request('MoneyInWebInit', ip, opts).get('MONEYINWEB')
  }

  registerCard (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.2',
      cardCode: _opts.cardCrypto
    })

    if (opts.cardNumber) {
      opts.cardType = utils.cardNumberToType(opts.cardNumber)
    }

    return this._request('RegisterCard', ip, opts).get('CARD')
  }

  unregisterCard (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('UnregisterCard', ip, opts).get('CARD')
  }

  moneyInWithCardId (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.1',
      amountTot: utils.numberToFixed(_opts.amount),
      amountCom: utils.numberToFixed(_opts.commission),
      autoCommission: utils.boolToString(_opts.autoCommission),
      isPreAuth: utils.boolToString(_opts.isPreAuth),
      wkToken: _opts.token
    })

    return this._request('MoneyInWithCardId', ip, opts, 'MoneyInResult').get('TRANS').get('HPAY')
  }

  moneyInValidate (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('MoneyInValidate', ip, opts).get('MONEYIN').get('HPAY')
  }

  sendPayment (ip, _opts) {
    const opts = _.assign({}, _opts, {
      amount: utils.numberToFixed(_opts.amount)
    })

    return this._request('SendPayment', ip, opts).get('TRANS').get('HPAY')
  }

  registerIBAN (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.1'
    })

    return this._request('RegisterIBAN', ip, opts).get('IBAN')
  }

  moneyOut (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.3',
      amountTot: utils.numberToFixed(_opts.amount),
      amountCom: utils.numberToFixed(_opts.commission),
      autoCommission: utils.boolToString(_opts.autoCommission)
    })

    return this._request('MoneyOut', ip, opts).get('TRANS').get('HPAY')
  }

  getPaymentDetails (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('GetPaymentDetails', ip, opts).get('TRANS').get('HPAY')
  }

  getMoneyInTransDetails (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.3',
      startDate: utils.dateToUnix(_opts.from) || 0,
      endDate: utils.dateToUnix(_opts.to)
    })

    return this._request('GetMoneyInTransDetails', ip, opts).get('TRANS').get('HPAY')
  }

  getMoneyOutTransDetails (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.4'
    })

    return this._request('GetMoneyOutTransDetails', ip, opts).get('TRANS').get('HPAY')
  }

  uploadFile (ip, _opts) {
    return new Promise((resolve, reject) => {
      const filePath = _.get(_opts, 'filePath')
      if (filePath) {
        return fs.readFile(filePath, (err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      }
      return resolve(_.get(_opts, 'file'))
    })
    .then((buffer) => (buffer instanceof Buffer) ? buffer.toString('base64') : buffer)
    .then((buffer) => {
      const opts = _.merge({
        version: '1.1'
      }, {
        wallet: _opts.wallet,
        fileName: _opts.fileName,
        type: _.get(constants.DOCUMENT_TYPE, _.get(_opts, 'type')),
        buffer: buffer,
        sddMandateId: _opts.sddMandateId
      })
      return this._request('UploadFile', ip, opts).get('UPLOAD')
    })
  }

  getKycStatus (ip, _opts) {
    const opts = _.merge({
      version: '1.5'
    }, {
      updateDate: utils.dateToUnix(_opts.from)
    })

    return this._request('GetKycStatus', ip, opts).get('WALLETS')
  }

  getMoneyInIBANDetails (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.4',
      updateDate: utils.dateToUnix(_opts.from) || 0
    })

    return this._request('GetMoneyInIBANDetails', ip, opts).get('TRANS').get('HPAY')
  }

  refundMoneyIn (ip, _opts) {
    const opts = _.assign({}, _opts, {
      amountToRefund: utils.numberToFixed(_opts.amount),
      version: '1.2'
    })

    return this._request('RefundMoneyIn', ip, opts).get('TRANS').get('HPAY')
  }

  getBalances (ip, _opts) {
    const opts = _.merge({}, {
      updateDate: utils.dateToUnix(_opts.from),
      walletIdStart: String(_opts.fromWalletId),
      walletIdEnd: String(_opts.toWalletId),
      version: '1.1'
    })

    return this._request('GetBalances', ip, opts).then((results) => {
      if (_.get(results, 'WALLETS.WALLET')) {
        return _.get(results, 'WALLETS.WALLET')
      }

      return []
    })
  }

  moneyIn3DAuthenticate (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('MoneyIn3DAuthenticate', ip, opts).get('MONEYIN')
  }

  createGiftCodeAmazon (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('CreateGiftCodeAmazon', ip, opts).get('CreateGiftCodeAmazonConfirm').get('HPAY')
  }

  moneyInIDealInit (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('MonetInIDealInit', ip, opts).get('IDEALINIT')
  }

  moneyInIDealConfirm (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('MoneyInIDealConfirm', ip, opts).get('TRANS').get('HPAY')
  }

  registerSDDMandate (ip, _opts) {
    const opts = _.assign({}, _opts, {
      isRecurring: utils.boolToString(_opts.isRecurring)
    })

    return this._request('RegisterSddMandate', ip, opts).get('SDDMANDATE')
  }

  unregisterSDDMandate (ip, _opts) {
    const opts = _.assign({}, _opts, {
      sddMandateId: utils.stringToInteger(_opts.sddMandateId)
    })

    return this._request('UnregisterSddMandate', ip, opts, 'UnRegisterSddMandateResult').get('SDDMANDATE')
  }

  moneyInSDDInit (ip, _opts) {
    const opts = _.assign({
      amountTot: utils.numberToFixed(_opts.amount),
      amountCom: utils.numberToFixed(_opts.commission)
    }, _opts, {
      autoCommission: utils.boolToString(_opts.autoCommission),
      sddMandateId: utils.stringToInteger(_opts.sddMandateId),
      collectionDate: utils.dateToDayString(_opts.collectionDate)
    })

    return this._request('MoneyInSddInit', ip, opts).get('TRANS').get('HPAY')
  }

  getMoneyInSDD (ip, _opts) {
    const opts = _.assign({
      updateDate: utils.dateToUnix(_opts.from) || 0
    }, _opts)

    return this._request('GetMoneyInSdd', ip, opts).then((val) => {
      const ret = _.get(val, 'TRANS', [])
      return _.isArray(ret) ? ret : []
    }).map((val) => _.get(val, 'HPAY'))
  }

  getMoneyInChequeDetails (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.9',
      updateDate: utils.dateToUnix(_opts.from) || 0
    })

    return this._request('GetMoneyInChequeDetails', ip, opts).get('TRANS').get('HPAY')
  }

  getWalletTransHistory (ip, _opts) {
    const opts = {
      version: '2.0',
      wallet: _opts.wallet
    }

    if (_opts.from) {
      opts.startDate = utils.dateToUnix(_opts.from)
    }

    if (_opts.to) {
      opts.endDate = utils.dateToUnix(_opts.to)
    }

    return this._request('GetWalletTransHistory', ip, opts).get('TRANS').then((results) => {
      if (_.get(results, 'HPAY')) {
        return _.get(results, 'HPAY')
      }

      return []
    })
  }

  getChargebacks (ip, _opts) {
    const opts = _.assign({}, _opts, {
      version: '1.8',
      updateDate: utils.dateToUnix(_opts.from) || 0
    })

    return this._request('GetChargebacks', ip, opts).get('TRANS').get('HPAY')
  }

  moneyInChequeInit (ip, _opts) {
    const opts = _.assign({
      amountTot: utils.numberToFixed(_opts.amount),
      amountCom: utils.numberToFixed(_opts.commission)
    }, _opts, {
      autoCommission: utils.boolToString(_opts.autoCommission)
    })

    return this._request('MoneyInChequeInit', ip, opts).get('TRANS').get('HPAY')
  }

  createVCC (ip, _opts) {
    const opts = _.assign({
      amount: utils.numberToFixed(_opts.amountVCC)
    }, _opts)

    return this._request('CreateVCC', ip, opts).get('TRANS').get('HPAY')
  }

  moneyInNeosurf (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('MoneyInNeosurf', ip, opts).get('TRANS').get('HPAY')
  }

  signDocumentInit (ip/*: string */, opts/*: any */) {
    return this._request('SignDocumentInit', ip, opts).get('SIGNDOCUMENT')
  }

  getWizypayAds (ip, _opts) {
    const opts = _.assign({}, _opts)

    return this._request('GetWizypayAds', ip, opts)
      .then((data) => ([
        data.OFFERS.OFFER,
        data.ADS.AD
      ]))
  }
}
