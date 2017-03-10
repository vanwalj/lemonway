'use strict'

const Chance = require('chance')
const Lemonway = require('../../')

const chance = new Chance()

describe('get money in', function () {
  this.timeout(2000000)

  it('list transactions', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
    lemonway.Transaction.getMoneyInTransDetails(chance.ip(), {
      after: 0
    })
      .then((transactions) => done())
      .catch(done)
  })

  it('list transactions', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
    lemonway.Transaction.list(chance.ip())
      .then((transactions) => done())
      .catch(done)
  })
})
