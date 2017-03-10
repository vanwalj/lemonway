'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('sign sdd mandate', function () {
  this.timeout(2000000)

  it('sign a sdd mandate', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL)
    const id = chance.word({ syllables: 5 })
    lemonway.Wallet.create(chance.ip(), {
      id: id,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    })
    .then((wallet) => wallet.updateWalletStatus(chance.ip(), {
      status: 'KYC_2'
    })
    .then((wallet) => wallet.registerSDDMandate(chance.ip(), {
      holder: `${chance.first()} ${chance.last()}`,
      bic: 'ABCDEFGHIJK',
      iban: 'FR1420041010050500013M02606',
      isRecurring: false
    }))
    .then((mandate) => mandate.signDocumentInit(chance.ip(), wallet, {
      mobileNumber: '33770482948',
      returnUrl: chance.url(),
      errorUrl: chance.url()
    })))
    .then((mandate) => done())
    .catch(done)
  })
})
