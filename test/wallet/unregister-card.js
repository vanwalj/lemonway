'use strict'

var Chance = require('chance')

var Lemonway = require('../../')

var chance = new Chance()

describe('unregister card', function () {
  this.timeout(2000000)

  it('detach a card', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL)
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.registerCard(chance.ip(), {
        cardNumber: '5017670000001800',
        cardCrypto: '666',
        cardDate: '09/2016'
      }).then(function (card) {
        return wallet.unregisterCard(chance.ip(), card)
      })
    }).then(function (card) {
      return done()
    }).catch(done)
  })
})
