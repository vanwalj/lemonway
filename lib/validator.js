'use strict'

const Joi = require('joi')
const Promise = require('bluebird')

module.exports = (value, schema) =>
  new Promise((resolve, reject) =>
    Joi.validate(value, schema, {
      abortEarly: false,
      stripUnknown: true
    }, (err, result) => err ? reject(err) : resolve(result))
  )
