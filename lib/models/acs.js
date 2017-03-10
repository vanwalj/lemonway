// @flow
'use strict'
const querystring = require('querystring')
const _ = require('lodash')

const sessionIdReg = /.*;jsessionid=(.*\..*)\??/

const template = _.template('<%= url %>?<%= query %>')

module.exports = class Acs {
  constructor ({
    actionMethod, pareqFieldName, pareqFieldValue, termurlFieldName,
    mdFieldName, mdFieldValue, mpiResult, actionUrl
  } = {}) {
    this.actionMethod = actionMethod
    this.pareqFieldName = pareqFieldName
    this.pareqFieldValue = pareqFieldValue
    this.termurlFieldName = termurlFieldName
    this.mdFieldName = mdFieldName
    this.mdFieldValue = mdFieldValue
    this.mpiResult = mpiResult

    if (actionUrl) {
      this.actionUrl = decodeURIComponent(actionUrl)
      const actionUrlMatch = this.actionUrl.match(sessionIdReg)
      if (actionUrlMatch.length >= 2) {
        this.sessionId = actionUrlMatch[1]
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
