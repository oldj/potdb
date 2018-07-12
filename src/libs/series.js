/**
 * series.js
 */

'use strict'

module.exports = function (tasks, initial) {
  if (!Array.isArray(tasks)) {
    return Promise.reject(new TypeError('tasks should be an array'))
  }

  return tasks.reduce((current, next) => {
    return current.then(next)
  }, Promise.resolve(initial))
}
