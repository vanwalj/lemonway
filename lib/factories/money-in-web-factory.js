// @flow
'use strict'
const querystring = require('querystring')

module.exports = class MoneyInWebFactory {
  constructor (lemonway) {
    this.MoneyInWeb = class MoneyInWeb {
      constructor ({ ID, TOKEN, CARD } = {}) {
        this.id = ID
        this.token = TOKEN
        if (CARD) {
          this.cardId = CARD.ID
        }
      }
      getWebKitRedirectUrl ({ cssUrl, lang }) {
        const query = querystring.stringify({
          moneyInToken: this.token,
          p: cssUrl,
          lang: lang
        })
        return `${lemonway._webKitUrl}?${query}`
      }
    }
  }
}
