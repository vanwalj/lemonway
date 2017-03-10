'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('Get money in IBAN', function () {
  this.timeout(2000000)

  it('create a wallet', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
    lemonway.Transaction.getMoneyInIBANDetails(chance.ip(), {
      after: 0
    })
    .then((transactions) => done())
    .catch(done)
  })
})
