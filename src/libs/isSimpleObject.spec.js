/**
 * isSimpleObject.spec.js
 */

'use strict'

const {test} = require('ava')
const isSimpleObject = require('./isSimpleObject')

test('isSimpleObject', async t => {
  t.true(isSimpleObject(1))
  t.true(isSimpleObject(100.12))
  t.true(isSimpleObject(-100.12))
  t.true(isSimpleObject('100'))
  t.true(isSimpleObject('aaa'))
  t.true(isSimpleObject(''))
  t.true(isSimpleObject(undefined))
  t.true(isSimpleObject(null))
  t.true(isSimpleObject(true))
  //t.false(isSimpleObject(Math))

  t.true(isSimpleObject({}))
  t.true(isSimpleObject({'a': 1}))
  t.true(isSimpleObject([1, 2, 3]))
  t.true(isSimpleObject([1, 2, 3, {a: 1, b: 'bb', c: ['a', 'b']}]))
})
