'use strict'
const info = require('debug')('info')

if (!process.env.LOGIN || !process.env.PASS || !process.env.ENDPOINT) {
  info('***')
  info(' Set `LOGIN` `PASS` & `ENDPOINT` env for testing')
  info(' http://documentation.lemonway.fr/api-fr/introduction/tests-et-comptes-par-defaut')
  info(' LOGIN=society PASS=123456 ENDPOINT=https://ws.lemonway.fr/mb/{ENDPOINT}/directkitjson/service.asmx?WSDL npm test')
  info('***')
  process.exit(1)
}

describe('Lemonway SDK', () => {
  require('./wallet')
  require('./transaction')
})
