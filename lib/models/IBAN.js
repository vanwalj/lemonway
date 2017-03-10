// @flow
'use strict'
module.exports = class IBAN {
  constructor ({ ID, S, DATA, SWIFT, HOLDER }) {
    this.id = ID
    this.status = S
    this.iban = DATA
    this.swift = SWIFT
    this.holder = HOLDER
  }
}
