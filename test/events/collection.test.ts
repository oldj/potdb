/**
 * collection.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as path from 'path'
import PotDb from '@/index'

describe('events.collection', () => {
  const db_path = path.join(path.dirname(__dirname), 'tmp')
  const db = new PotDb(db_path)

  beforeEach(async () => {
    await db.collection.ttcol.remove()
  })

  afterEach(async () => {
    db.clearListeners()
  })

  it('collection.insert', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let all = await db.collection.ttcol.all()
      assert.equal(all.length, 0)

      db.addListener((event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        try {
          assert.equal(event.action, 'add')
          assert.equal(event.value.a, 1)
          assert.equal(typeof event.value._id, 'string')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol.insert({ a: 1 })
    })
  })

  it('collection._insert', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let all = await db.collection.ttcol.all()
      assert.equal(all.length, 0)

      db.addListener((event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        try {
          assert.equal(event.action, 'add')
          assert.equal(event.value.a, 'AA')
          assert.equal(event.value._id, '333')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol._insert({ _id: '333', a: 'AA' })
    })
  })

  it('collection.update', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let all = await db.collection.ttcol.all()
      assert.equal(all.length, 0)

      await db.collection.ttcol.insert({ a: 'AA' })

      db.addListener((event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        try {
          assert.equal(event.action, 'update')
          assert.isTrue(Array.isArray(event.value))
          assert.equal(event.value[0].a, 'aa')
          assert.equal(event.value[0].b, 'bb')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol.update((i) => i.a === 'AA', { a: 'aa', b: 'bb' })
    })
  })

  it('collection.update #2', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let all = await db.collection.ttcol.all()
      assert.equal(all.length, 0)

      await db.collection.ttcol.insert({ a: 'AA', x: 1 })
      await db.collection.ttcol.insert({ a: 'AA', x: 2 })

      db.addListener((event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        try {
          assert.equal(event.action, 'update')
          assert.isTrue(Array.isArray(event.value))
          assert.equal(event.value.length, 2)
          assert.equal(event.value[0].a, 'aa')
          assert.equal(event.value[0].b, 'bb')
          assert.equal(event.value[0].x, 1)
          assert.equal(event.value[1].a, 'aa')
          assert.equal(event.value[1].b, 'bb')
          assert.equal(event.value[1].x, 2)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol.update((i) => i.a === 'AA', { a: 'aa', b: 'bb' })
    })
  })

  it('collection.delete', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.collection.ttcol.insert({ a: 'AA', x: 1 })
      await db.collection.ttcol.insert({ a: 'AA', x: 2 })

      db.addListener(async (event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        // console.log(event)
        try {
          assert.equal(event.action, 'delete')
          let all: any[] = await db.collection.ttcol.all()
          assert.equal(all.length, 1)
          assert.equal(all[0].a, 'AA')
          assert.equal(all[0].x, 2)
          assert.equal(all[0]._id, '2')

          assert.equal(event.value.length, 1)
          assert.equal(event.value[0], '1')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol.delete((i) => i.x === 1)
    })
  })

  it('collection.remove', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.collection.ttcol.insert({ a: 'AA', x: 1 })
      await db.collection.ttcol.insert({ a: 'AA', x: 2 })

      db.addListener(async (event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        // console.log(event)
        try {
          assert.equal(event.action, 'delete')
          let all: any[] = await db.collection.ttcol.all()
          assert.equal(all.length, 0)
          assert.equal(event.value, '*')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol.remove()
    })
  })

  it('named listener collection.update', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let all = await db.collection.ttcol.all()
      assert.equal(all.length, 0)

      await db.collection.ttcol.insert({ a: 'AA' })

      db.addNamedListener('collection.ttcol:update', (event) => {
        if (event.type !== 'collection' || event.name !== 'ttcol') return

        try {
          assert.equal(event.action, 'update')
          assert.isTrue(Array.isArray(event.value))
          assert.equal(event.value[0].a, 'aa')
          assert.equal(event.value[0].b, 'bb')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.collection.ttcol.update((i) => i.a === 'AA', { a: 'aa', b: 'bb' })
    })
  })
})
