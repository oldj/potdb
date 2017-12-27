/**
 * waitUntil.js
 */

'use strict'

module.exports = (test, step = 50) => new Promise(resolve => {
  if (test()) {
    resolve()
    return
  }

  let t = setInterval(() => {
    if (test()) {
      resolve()
      clearInterval(t)
    }
  }, step)
})
