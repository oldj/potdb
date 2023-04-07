/**
 * event.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as path from 'path'
import PotDb from 'src'

describe.only('event', () => {
  it('dict.update', async (done) => {
    const db_path = path.join(__dirname, 'tmp')
    const db = new PotDb(db_path)
    // console.log(db)
    assert(db.dir === db_path)

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
})
