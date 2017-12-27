/**
 * isSimpleObject.js
 */

'use strict'

const isSimpleValue = v => {
  let t = typeof v

  return t === 'string' || t === 'number' || t === 'boolean' || t === 'undefined' || v === null
}

const judge = o => {
  if (Array.isArray(o)) {
    for (let i = o.length - 1; i >= 0; i--) {
      if (!judge(o[i])) {
        return false
      }
    }
  } else if (typeof o === 'object') {
    if (o === null) return true

    for (let k in o) {
      if (o.hasOwnProperty(k) && !judge(o[k])) {
        return false
      }
    }
  } else {
    return isSimpleValue(o)
  }

  return true
}

module.exports = judge
