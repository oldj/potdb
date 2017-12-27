/**
 * index.js
 */

'use strict'

const Cup = require('./Cup')

let instances = {}

module.exports = (path, options) => {
  if (!instances.hasOwnProperty(path)) {
    instances[path] = new Cup(path, options)
  }

  return instances[path]
}
