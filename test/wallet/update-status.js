'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('update wallet status', function () {
  this.timeout(2000000);

  it('update a wallet status', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    const id = chance.word();
    lemonway.clone().setUserIp(chance.ip()).Wallet.create({
      id: id,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).updateWalletStatus({
      status: 6
    }).then(function (wallet) {
      expect(wallet.id).to.equal(id);
      return done();
    }).catch(done);
  });
});