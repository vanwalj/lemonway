'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('money in', function () {
  this.timeout(2000000)

  it('credit a wallet', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    })
    .then((wallet) => wallet.moneyIn(chance.ip(), {
      amount: 10.00,
      cardNumber: '5017670000006700',
      cardCrypto: '666',
      cardDate: '10/2016',
      autoCommission: true
    }))
    .then((transaction) => done())
    .catch(done)
  })
})
