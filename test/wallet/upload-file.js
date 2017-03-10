'use strict'

const Chance = require('chance')

const Lemonway = require('../../')

const chance = new Chance()

describe('upload file', function () {
  this.timeout(2000000)

  it('upload a file', (done) => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT)
    return lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    })
    .then((wallet) => wallet.uploadFile(chance.ip(), {
      fileName: 'RIB.png',
      type: 'RIB',
      filePath: './test/wallet/RIB.png'
    }))
    .then((document) => done())
    .catch(done)
  })
})
