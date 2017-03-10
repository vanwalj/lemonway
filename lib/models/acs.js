'use strict'

const querystring = require('querystring')
const _ = require('lodash')

const sessionIdReg = /.*;jsessionid=(.*\..*)\??/

const template = _.template('<%= url %>?<%= query %>')

module.exports = class Acs {
  constructor (data) {
    if (data) {
      this.actionMethod = data.actionMethod
      this.pareqFieldName = data.pareqFieldName
      this.pareqFieldValue = data.pareqFieldValue
      this.termurlFieldName = data.termurlFieldName
      this.mdFieldName = data.mdFieldName
      this.mdFieldValue = data.mdFieldValue
      this.mpiResult = data.mpiResult

      if (data.actionUrl) {
        this.actionUrl = decodeURIComponent(data.actionUrl)
        const actionUrlMatch = this.actionUrl.match(sessionIdReg)
        if (actionUrlMatch.length >= 2) {
          this.sessionId = actionUrlMatch[1]
        }
      }
    }
  }

  getRedirectUrl (redirectUrl) {
    const query = {}
    if (this.pareqFieldName) {
      query[this.pareqFieldName] = this.pareqFieldValue
    }
    if (this.mdFieldName) {
      query[this.mdFieldName] = this.mdFieldValue
    }
    if (this.termurlFieldName) {
      query[this.termurlFieldName] = redirectUrl
    }

    return template({ url: this.actionUrl, query: querystring.stringify(query) })
  }
}
