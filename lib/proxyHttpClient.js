// @flow
'use strict'

const HttpClient = require('soap/lib/http')

module.exports = class ProxyHttpClient extends HttpClient {
  constructor (sourceUri/*: string */, proxyUri/*: string */) {
    super()

    this.proxyUri = proxyUri
    const repSourceUri = sourceUri.replace(/\./g, '\\.').replace(/\//g, '\\/')
    this.sourceUriOccurrences = new RegExp(`(<soap(12)?:address location=")${repSourceUri}`, 'gi')
  }

  request (rurl/*: string */, data, callback, exheaders, exoptions) {
    const options = this.buildRequest(rurl, data, exheaders, exoptions)
    const headers = options.headers

    const req = this._request(options, (err, res, body) => {
      if (err) {
        return callback(err)
      }
      body = this.handleResponse(req, res, body)

      return callback(null, res, this.rewrite(body))
    })

    if (headers.Connection !== 'keep-alive') {
      req.end(data)
    }
    return req
  }

  rewrite (body/*: string */) {
    return body.replace(this.sourceUriOccurrences, `$1${this.proxyUri}`)
  }
}
