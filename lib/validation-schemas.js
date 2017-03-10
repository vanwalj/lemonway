// @flow
'use strict'

const _ = require('lodash')
const Joi = require('joi')

const constants = require('./constants')

Joi.lemonwayBase = () =>
  Joi.object({
    walletIp: Joi.string().ip(),
    walletUa: Joi.string(),
    version: Joi.string()
  })

Joi.RegisterWallet = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(1).max(100).required(),
    clientMail: Joi.string().email().min(6).max(256).required(),
    clientTitle: Joi.string().valid(['M', 'F', 'J', 'U']),
    clientFirstName: Joi.string().min(2).max(256).required(),
    clientLastName: Joi.string().min(2).max(256).required(),
    street: Joi.string().max(256),
    postCode: Joi.string().max(10),
    city: Joi.string().max(140),
    ctry: Joi.string().length(3),
    phoneNumber: Joi.string().min(6).max(30),
    mobileNumber: Joi.string().min(6).max(30),
    birthdate: Joi.date().format('dd/MM/yyyy'),
    isCompany: Joi.string().valid(['0', '1']),
    companyName: Joi.string().min(1).max(256),
    companyWebsite: Joi.string().min(1).max(256),
    companyDescription: Joi.string().min(1).max(256),
    companyIdentificationNumber: Joi.string().min(1).max(256),
    isDebtor: Joi.string().valid(['0', '1']),
    nationality: Joi.string().max(19),
    birthcity: Joi.string().max(140),
    birthcountry: Joi.string().length(3),
    payerOrBeneficiary: Joi.string().valid(['0', '1', '2']),
    isOneTimeCustomer: Joi.string().valid(['0', '1'])
  }))

Joi.UpdateWalletDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(1).max(100).required(),
    newEmail: Joi.string().email().min(6).max(256),
    newTitle: Joi.string().valid(['M', 'F', 'J', 'U']),
    newFirstName: Joi.string().min(2).max(256),
    newLastName: Joi.string().min(2).max(256),
    newStreet: Joi.string().max(256),
    newPostCode: Joi.string().max(10),
    newCity: Joi.string().max(140),
    newCtry: Joi.string().length(3),
    newIp: Joi.string().ip(),
    newPhoneNumber: Joi.string().min(6).max(30),
    newMobileNumber: Joi.string().min(6).max(30),
    newBirthdate: Joi.date().format('dd/MM/yyyy'),
    newIsCompany: Joi.string().valid(['0', '1']),
    newCompanyName: Joi.string().min(1).max(256),
    newCompanyWebsite: Joi.string().min(1).max(256),
    newCompanyDescription: Joi.string().min(1).max(256),
    newCompanyIdentificationNumber: Joi.string().min(1).max(256),
    newIsDebtor: Joi.string().valid(['0', '1']),
    newNationality: Joi.string().max(19),
    newBirthcity: Joi.string().max(140),
    newBirthcountry: Joi.string().length(3)
  }))

Joi.UpdateWalletStatus = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(1).max(256),
    newStatus: Joi.string().allow(['5', '6', '12'])
  }))

Joi.GetWalletDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100),
    email: Joi.string().email().max(256)
  }).or('wallet', 'email'))

Joi.MoneyIn = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(256).required(),
    cardType: Joi.string().allow(['0', '1', '2']).required(),
    cardNumber: Joi.string().creditCard().required(),
    cardCrypto: Joi.string().length(3).required(),
    cardDate: Joi.string().required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string().max(140),
    autoCommission: Joi.string().allow(['0', '1']),
    isPreAuth: Joi.string().allow(['0', '1']),
    delayedDays: Joi.number().min(1).max(99),
    wkToken: Joi.string().max(50),
    specialConfig: Joi.string()
  }))

Joi.MoneyIn3DInit = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardNumber: Joi.string().creditCard().required(),
    cardCode: Joi.string().length(3).required(),
    cardDate: Joi.string().required(),
    cardType: Joi.string().required().valid(_.values(constants.CARD_TYPE)),
    amountTot: Joi.string().required(),
    returnUrl: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string().max(140),
    autoCommission: Joi.string().allow(['0', '1']),
    wkToken: Joi.string().max(50),
    specialConfig: Joi.string()
  }))

Joi.MoneyIn3DConfirm = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number().required(),
    MD: Joi.string(),
    PaRes: Joi.string(),
    cardType: Joi.string().allow(['0', '1', '2']),
    cardNumber: Joi.string().creditCard(),
    cardCode: Joi.string().length(3),
    cardDate: Joi.date().format('MM/yyyy'),
    isPreAuth: Joi.string().allow(['0', '1']),
    specialConfig: Joi.string()
  }))

Joi.MoneyInWebInit = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string().max(140),
    useRegisteredCard: Joi.string().allow(['0', '1']),
    wkToken: Joi.string().max(50).required(),
    returnUrl: Joi.string().min(1).required(),
    errorUrl: Joi.string().min(1).required(),
    cancelUrl: Joi.string().min(1).required(),
    autoCommission: Joi.string().allow(['0', '1']).required(),
    registerCard: Joi.string().allow(['0', '1'])
  }))

Joi.RegisterCard = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardType: Joi.string().allow(['0', '1', '2']).required(),
    cardNumber: Joi.string().creditCard().required(),
    cardCode: Joi.string().length(3).required(),
    cardDate: Joi.string().required(),
    specialConfig: Joi.string()
  }))

Joi.UnregisterCard = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardId: Joi.string().min(1).max(12).required()
  }))

Joi.MoneyInWithCardId = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardId: Joi.string().max(256).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string().max(140),
    autoCommission: Joi.string().allow(['0', '1']).required(),
    isPreAuth: Joi.string().allow(['0', '1']),
    delayedDays: Joi.number().min(1).max(99),
    specialConfig: Joi.string()
  }))

Joi.MoneyInValidate = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number().required(),
    specialConfig: Joi.string()
  }))

Joi.SendPayment = () =>
  Joi.lemonwayBase().concat(Joi.object({
    debitWallet: Joi.string().max(256).required(),
    creditWallet: Joi.string().max(256).required(),
    amount: Joi.string().required(),
    message: Joi.string().max(140),
    scheduledDate: Joi.date().format('yyyy/MM/dd'),
    privateData: Joi.string().max(5139)
  }))

Joi.RegisterIBAN = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    holder: Joi.string().min(1).max(100).required(),
    bic: Joi.string().min(8).max(11),
    iban: Joi.string().min(15).max(34),
    dom1: Joi.string().min(1).max(26),
    dom2: Joi.string().min(1).max(26),
    comment: Joi.string().min(1).max(512)
  }))

Joi.MoneyOut = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    message: Joi.string().max(140),
    ibanId: Joi.string().max(10),
    autoCommission: Joi.string().allow(['0', '1']).required()
  }))

Joi.GetPaymentDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number(),
    transactionComment: Joi.string().max(140),
    privateData: Joi.string().max(5139)
  }))

Joi.GetMoneyInTransDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number(),
    transactionComment: Joi.string().max(140),
    transactionMerchantToken: Joi.string().max(50),
    startDate: Joi.number(),
    endDate: Joi.number()
  }))

Joi.GetMoneyOutTransDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number(),
    transactionComment: Joi.string().max(140)
  }))

Joi.UploadFile = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    fileName: Joi.string().required(),
    type: Joi.string().required(),
    buffer: Joi.any().required(),
    sddMandateId: Joi.alternatives().try(Joi.number(), Joi.string())
  }))

Joi.GetKycStatus = () =>
  Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }))

Joi.GetMoneyInIBANDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }))

Joi.RefundMoneyIn = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.string().max(10).required(),
    comment: Joi.string().max(140),
    amountToRefund: Joi.string()
  }))

Joi.GetBalances = () =>
  Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number(),
    walletIdStart: Joi.string(),
    walletIdEnd: Joi.string()
  }))

Joi.MoneyIn3DAuthenticate = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number().required(),
    MD: Joi.string(),
    PaRes: Joi.string(),
    cardType: Joi.string().valid(['0', '1', '2']),
    cardNumber: Joi.string().creditCard(),
    cardCode: Joi.string().length(3),
    cardDate: Joi.date().format('MM/yyyy')
  }))

Joi.CreateGiftCodeAmazon = () =>
  Joi.lemonwayBase().concat(Joi.object({
    debitWallet: Joi.string().required(),
    amountAGCOD: Joi.string().required()
  }))

Joi.MoneyInIDealInit = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    issuerId: Joi.string().required(),
    comment: Joi.string(),
    returnUrl: Joi.string().required(),
    autoCommission: Joi.string.valid(['0', '1']).required()
  }))

Joi.MoneyInIDealConfirm = () =>
  Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number().required()
  }))

Joi.RegisterSddMandate = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    holder: Joi.string().required(),
    bic: Joi.string().required(),
    iban: Joi.string().required(),
    isRecurring: Joi.string().valid(['0', '1']).required(),
    street: Joi.string(),
    postCode: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    mandateLanguage: Joi.string()
  }))

Joi.UnregisterSddMandate = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    sddMandateId: Joi.alternatives().try(Joi.number(), Joi.string()).required()
  }))

Joi.MoneyInSddInit = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string(),
    autoCommission: Joi.string().valid(['0', '1']).required(),
    sddMandateId: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
    collectionDate: Joi.string()
  }))

Joi.GetMoneyInSdd = () =>
  Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }))

Joi.GetMoneyInChequeDetails = () =>
  Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }))

Joi.GetWalletTransHistory = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(256).required(),
    startDate: Joi.number(),
    endDate: Joi.number()
  }))

Joi.GetChargebacks = () =>
  Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }))

Joi.MoneyInChequeInit = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string(),
    autoCommission: Joi.string().valid(['0', '1']).required()
  }))

Joi.SignDocumentInit = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    mobileNumber: Joi.string(),
    documentId: Joi.number().required(),
    documentType: Joi.number().required(),
    returnUrl: Joi.string().required(),
    errorUrl: Joi.string().required()
  }))

Joi.CreateVCC = () =>
  Joi.lemonwayBase().concat(Joi.object({
    debitWallet: Joi.string().required(),
    amountVCC: Joi.string().required()
  }))

Joi.MoneyInNeosurf = () =>
  Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(100).required(),
    amountTot: Joi.string().required(),
    amountCom: Joi.string(),
    comment: Joi.string(),
    idTicket: Joi.number().required(),
    isNeocode: Joi.string().valid(['0', '1']).required(),
    wktoken: Joi.string()
  }))

Joi.GetWizypayAds = () => Joi.lemonwayBase()

module.exports = Joi
