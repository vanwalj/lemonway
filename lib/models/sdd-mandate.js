'use strict'
module.exports = class SDDMandate {
  constructor ({ ID, S, DATA, SWIFT }) {
    this.id = ID
    this.status = S
    this.iban = DATA
    this.swift = SWIFT
  }
}
