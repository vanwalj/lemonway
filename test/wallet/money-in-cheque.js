'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('money in cheque', function () {
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
    .then((wallet) =>
      wallet.moneyInChequeInit(chance.ip(), {
        amount: 10.0,
        autoCommission: true
      })
    )
    .then(() => done())
    .catch(done)
  })
})
