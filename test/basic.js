/**
 * basic.js
 */

'use strict'

const fs = require('fs')
const path = require('path')
const R = require('ramda')
const {test} = require('ava')
const mkdirp = require('mkdirp')
const cupDB = require('../src')

const tmp_dir = path.resolve(path.join(__dirname, 'tmp'))
const fn1 = path.join(tmp_dir, '1.db')

test.beforeEach(async t => {
  //fs.existsSync(fn) && fs.unlinkSync(fn)
  if (!fs.statSync(tmp_dir).isDirectory()) {
    mkdirp(tmp_dir)
  }

  t.context.db = cupDB(fn1)
})

test.afterEach(async t => {
  await t.context.db.close()
  //let fn = t.context.db.fn
  //fs.existsSync(fn) && fs.unlinkSync(fn)
})

test('basic', async t => {
  let db = t.context.db

  await db.setItem('a', 1)
  await db.setItem('b', 'BB')
  t.is(await db.getItem('a'), 1)
  t.is(await db.getItem('b'), 'BB')
})

test('read', async t => {
  let db = t.context.db

  let fn = path.join(tmp_dir, '00.db')
  let db1 = cupDB(fn)
  let db2 = cupDB(fn)
  db1.setItem('a155050', 'AA')
  t.is(await db2.getItem('a155050'), 'AA')
  t.is(await db.getItem('a155050'), undefined)
  //t.is(await db.getItem('a'), 1)

  db1.close()
  db2.close()
})

test('random write', async t => {
  let db = t.context.db

  let d = R.times(R.identity, 100).map(i => i + Math.random())
  d.map(async (i, idx) => await db.setItem('rw' + idx, i))

  let db2 = cupDB(fn1)
  t.true(await db2.getItem('rw5') > 5)
  t.true(await db2.getItem('rw25') < 26)

  let s = 'abcdefghijklmn汉字123~!@#'
  d.map(async (i, idx) => await db.setItem('rw:s' + idx, idx + s))
  t.is(await db2.getItem('rw:s95'), '95' + s)
})

test('remove', async t => {
  let db = t.context.db

  db.setItem('rr', ['1', '2', '3'])
  db.close()

  let db2 = cupDB(fn1)
  console.log(await db2.getItem('rr'))
  t.is((await db2.getItem('rr')).join('.'), '1.2.3')
  //db2.remove('rr')
  //t.is(await db2.getItem('rr'), undefined)
})
