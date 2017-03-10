'use strict'

const Joi = require('joi')

module.exports = (value, schema) =>
  new Promise((resolve, reject) =>
    Joi.validate(value, schema, {
      abortEarly: false,
      stripUnknown: true
    }, (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  )
