'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('Get money in SDD', function () {
  this.timeout(2000000)

  it('create a wallet', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
    lemonway.Transaction.getMoneyInSDD(chance.ip(), {
      after: new Date('2011-04-11')
    })
    .then((transactions) => done())
    .catch(done)
  })
})
