'use strict'

const info = require('debug')('info')
const open = require('open')
const Promise = require('bluebird')
const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('money in sdd', function () {
  this.timeout(2000000)

  it('credit a wallet', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL)
    const id = chance.word({ syllables: 5 })
    lemonway.Wallet.create(chance.ip(), {
      id: id,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    })
    .then((wallet) =>
      wallet.updateWalletStatus(chance.ip(), {
        status: 'KYC_2'
      })
      .then((wallet) =>
        wallet.registerSDDMandate(chance.ip(), {
          holder: `${chance.first()} ${chance.last()}`,
          bic: 'ABCDEFGHIJK',
          iban: 'FR1420041010050500013M02606',
          isRecurring: false
        })
      )
      .then((mandate) =>
        mandate.signDocumentInit(chance.ip(), wallet, {
          mobileNumber: process.env.PHONE,
          returnUrl: chance.url(),
          errorUrl: chance.url()
        })
        .then((signMandate) => {
          open(signMandate.redirectUrl)
          info('Go to', signMandate.redirectUrl, 'then, press enter to resume')
          return new Promise((resolve) =>
            process.stdin.on('data', () =>
              resolve(wallet.moneyInSDDInit(chance.ip(), mandate, {
                amount: 100.0,
                autoCommission: true
              }))
            )
          )
        })
      )
    )
    .then(() => done())
    .catch(done)
  })
})
