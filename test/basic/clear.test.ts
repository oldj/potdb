/**
 * clear.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

// import * as assert from 'assert'
import { assert } from 'chai'
// import PotDb from '../src'
import PotDb from '../../build'
import { db_path } from '../cfgs'
import lodash from 'lodash'

describe('basic.clear', () => {
  it('basic test', async () => {
    return new Promise(async (resolve, reject) => {
      const db = new PotDb(db_path)
      // console.log(db)
      assert(db.dir === db_path)

      await db.dict.d1.set('a', 1)
      await db.dict.d2.set('b', 2)
      await db.list.l1.push(1)
      await db.list.l1.push(2)
      await db.set.s1.add(1)
      await db.set.s1.add(1)
      await db.collection.c1.insert({ id: 1, v: 2 })
      await db.collection.c1.insert({ id: 2, v: 'xxx' })
      await db.collection.c2.insert({ id: 100, v: '111' })

      assert.equal(await db.dict.d1.get('a'), 1)
      assert.equal(await db.dict.d2.get('b'), 2)
      assert.deepEqual(await db.list.l1.all(), [1, 2])
      assert.deepEqual(await db.set.s1.all(), [1])
      let records: any[] = await db.collection.c1.all()
      assert.deepEqual(
        records.map((i) => lodash.pick(i, ['id', 'v'])),
        [
          { id: 1, v: 2 },
          { id: 2, v: 'xxx' },
        ],
      )
      records = await db.collection.c2.all()
      assert.deepEqual(
        records.map((i) => lodash.pick(i, ['id', 'v'])),
        [{ id: 100, v: '111' }],
      )

      db.addListener((event) => {
        console.log(event)
        reject('should not emit event!')
      })

      await db.clearSilent()
      assert.deepEqual(await db.dict.d1.all(), {})
      assert.deepEqual(await db.dict.d2.all(), {})
      assert.deepEqual(await db.list.l1.all(), [])
      assert.deepEqual(await db.set.s1.all(), [])
      assert.deepEqual(await db.collection.c1.all(), [])
      assert.deepEqual(await db.collection.c2.all(), [])

      setTimeout(resolve, 1000)
    })
  })
})
