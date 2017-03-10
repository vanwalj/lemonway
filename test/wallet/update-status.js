'use strict'

const expect = require('chai').expect
const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('update wallet status', function () {
  this.timeout(2000000)

  it('update a wallet status', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
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
    }))
    .then((wallet) => {
      expect(wallet.id).to.equal(id)
      return done()
    })
    .catch(done)
  })
})
