/**
 * set.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as path from 'path'
import PotDb from '@/index'

describe('events.set', () => {
  const db_path = path.join(path.dirname(__dirname), 'tmp')
  const db = new PotDb(db_path)

  beforeEach(async () => {
    await db.list.ttset.clear()
    assert.equal((await db.list.ttset.all()).length, 0)
  })

  afterEach(async () => {
    db.clearListeners()
  })

  it('set.add', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'set')
          assert.equal(event.name, 'ttset')
          assert.equal(event.value[event.value.length - 1], 123)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.set.ttset.add(123)
    })
  })

  it('set.delete', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.set.ttset.add(123)
      await db.set.ttset.add(124)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'set')
          assert.equal(event.name, 'ttset')
          assert.equal(event.value[event.value.length - 1], 123)
          assert.equal(event.value.length, 1)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.set.ttset.delete(124)
    })
  })

  it('set.clear', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.set.ttset.add(123)
      await db.set.ttset.add(124)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'set')
          assert.equal(event.name, 'ttset')
          assert.equal(event.value.length, 0)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.set.ttset.clear()
    })
  })

  it('set.set', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.set.ttset.set([123, 124])
      assert.equal((await db.set.ttset.all()).length, 2)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'set')
          assert.equal(event.name, 'ttset')
          assert.equal(event.value.length, 3)
          assert.equal(event.value.join(','), 'abc,def,ghi')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.set.ttset.set(['abc', 'def', 'ghi'])
    })
  })

  it('set.remove', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.set.ttset.set([123, 124])
      assert.equal((await db.set.ttset.all()).length, 2)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'delete')
          assert.equal(event.type, 'set')
          assert.equal(event.name, 'ttset')
          assert.equal(event.value, undefined)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.set.ttset.remove()
    })
  })

  it('set.update', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.set.ttset.set([123, 124])
      assert.equal((await db.set.ttset.all()).length, 2)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'set')
          assert.equal(event.name, 'ttset')
          assert.equal(event.value.length, 3)
          assert.equal(event.value.join(','), 'abc,def,ghi')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.set.ttset.update(['abc', 'def', 'ghi'])
    })
  })
})
