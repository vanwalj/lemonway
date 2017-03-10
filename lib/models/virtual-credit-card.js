'use strict'
module.exports = class VirtualCreditCard {
  constructor ({ ID, NUM, EDATE, CVX }) {
    this.id = ID
    this.number = NUM
    this.expirationDate = EDATE
    this.cvx = CVX
  }
}
