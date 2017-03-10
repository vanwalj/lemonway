// @flow
'use strict'
module.exports = class Card {
  constructor ({ ID, EXTRA }/*: { ID: string, EXTRA: string } */ = {}) {
    this.id = ID
    if (EXTRA) {
      this.is3DSecure = EXTRA.IS3DS
      this.country = EXTRA.CTRY
      this.authorizationNumber = EXTRA.AUTH
      this.cardAlias = EXTRA.NUM
      this.expirationDate = EXTRA.EXP
    }
  }
}
