/**
 * event.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as path from 'path'
import PotDb from 'src'

describe.only('event', () => {
  const db_path = path.join(__dirname, 'tmp')
  const db = new PotDb(db_path)

  beforeEach(async () => {})

  afterEach(async () => {
    db.clearListeners()
  })

  it('dict.update', async (done) => {
    db.addListener((event) => {
      try {
        // console.log(event)
        assert.equal(event.action, 'update')
        assert.equal(event.type, 'dict')
        assert.equal(event.name, 'ttdict')
        assert.equal(event.value.a, 1)
      } catch (e) {
        done(e)
        return
      }

      done()
    })

    await db.dict.ttdict.update({ a: 1 })
  })

  it('dict.set', async (done) => {
    db.addListener((event) => {
      try {
        // console.log(event)
        assert.equal(event.action, 'update')
        assert.equal(event.type, 'dict')
        assert.equal(event.name, 'ttdict')
        assert.equal(event.value.b, 2)
      } catch (e) {
        done(e)
        return
      }

      done()
    })

    await db.dict.ttdict.set('b', 2)
  })
})
