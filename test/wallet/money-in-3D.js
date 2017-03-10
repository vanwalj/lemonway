'use strict'

const info = require('debug')('info')
const Chance = require('chance')
const Promise = require('bluebird')
const open = require('open')

const Lemonway = require('../../')

const chance = new Chance()

describe('money in 3D', function () {
  this.timeout(2000000)

  it('credit a wallet', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL)
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then((wallet) => wallet.moneyIn3DInit(chance.ip(), {
      amount: 10.00,
      autoCommission: true,
      cardNumber: '5017670000001800',
      cardCrypto: '666',
      cardDate: '10/2016',
      token: chance.word({ syllables: 5 }),
      returnUrl: 'http://localhost:9999' // chance.url()
    }))
    .then((objs) => {
      process.stdin.resume()
      process.stdin.setEncoding('utf8')
      return new Promise((resolve) => {
        open(objs.acs.getRedirectUrl())
        info('Go to', objs.acs.getRedirectUrl(), 'then, press enter to resume')
        return process.stdin.on('data', () => resolve(objs.transaction.moneyIn3DConfirm(chance.ip())))
      })
    })
    .then((transaction) => done())
    .catch(done)
  })
})
