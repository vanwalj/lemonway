'use strict';

var expect = require('chai').expect;
var Chance = require('chance');
var Promise = require('bluebird');
var open = require('open');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in 3D auth', function () {
  this.timeout(2000000);

  it('credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    lemonway.clone().setUserIp(chance.ip()).Wallet.create({
      id: chance.word(),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.moneyIn3DInit({
        amount: 10.00,
        autoCommission: true,
        cardNumber: '5017670000001800',
        cardCrypto: '666',
        cardDate: '10/2016',
        token: chance.word(),
        returnUrl: chance.url()
      })
    }).then(function (objs) {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      return new Promise(function (resolve) {
        open(objs.acs.getRedirectUrl());
        console.log('Go to', objs.acs.getRedirectUrl(),'then, press enter to resume');
        return process.stdin.on('data', function () {
          return resolve(objs.transaction.moneyIn3DAuthenticate());
        });
      });
    }).then(function (transaction) {
      console.log(transaction);
      return done();
    }).catch(done);

  });

});