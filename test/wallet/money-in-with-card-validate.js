'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('money in with card validate', function () {
  this.timeout(2000000)

  it('credit a wallet', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL)
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    })
    .then((wallet) => {
      wallet.registerCard(chance.ip(), {
        cardNumber: '5017670000001800',
        cardCrypto: '666',
        cardDate: '09/2016'
      })
      .then((card) =>
        wallet.moneyInWithCard(chance.ip(), card, {
          amount: 10.0,
          autoCommission: true,
          isPreAuth: true
        })
        .then((transaction) => transaction.moneyInValidate(chance.ip()))
      )
    })
    .then((transaction) => done())
    .catch(done)
  })
})
