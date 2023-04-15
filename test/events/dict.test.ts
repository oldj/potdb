/**
 * dict.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as path from 'path'
import PotDb from '@/index'

describe('events.dict', () => {
  const db_path = path.join(path.dirname(__dirname), 'tmp')
  const db = new PotDb(db_path)

  beforeEach(async () => {})

  afterEach(async () => {
    db.clearListeners()
  })

  it('dict.update', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')
          assert.equal(event.value.a, 1)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.update({ a: 1 })
    })
  })

  it('dict.set', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')
          assert.equal(event.value.b, 2)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.set('b', 2)
    })
  })

  it('dict.delete', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.dict.ttdict.set('b', 2)
      let d = await db.dict.ttdict.get('b')
      assert.equal(d, 2)

      db.addListener(async (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')

          let d = await db.dict.ttdict.get('b')
          assert.equal(d, undefined)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.delete('b')
    })
  })

  it('dict.clear', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.dict.ttdict.set('b', 2)
      let d = await db.dict.ttdict.get('b')
      assert.equal(d, 2)

      db.addListener(async (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')

          let d = await db.dict.ttdict.get('b')
          assert.equal(d, undefined)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.clear()
    })
  })

  it('dict.remove', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.dict.ttdict.set('b', 20)
      let d = await db.dict.ttdict.get('b')
      assert.equal(d, 20)

      db.addListener(async (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'delete')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')

          let d = await db.dict.ttdict.get('b')
          assert.equal(d, undefined)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.remove()
    })
  })

  it('named listener dict.update', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let _chk = 0

      const chkResolve = () => {
        _chk++
        if (_chk === 2) {
          resolve()
        }
      }

      await db.dict.ttdict.set('b', 20)

      db.addNamedListener('dict.ttdict:update', (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')
          assert.equal(event.value.b, 30)
        } catch (e) {
          reject(e)
          return
        }

        chkResolve()
      })

      await db.dict.ttdict2.set('b', 33)
      await db.dict.ttdict.set('b', 30)

      db.addNamedListener('dict.ttdict2:update', (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict2')
          assert.equal(event.value.b, 35)
        } catch (e) {
          reject(e)
          return
        }

        chkResolve()
      })

      await db.dict.ttdict2.set('b', 35)
      // await db.dict.ttdict.set('b', 35)
    })
  })

  it('named listener dict.delete', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.dict.ttdict.set('b', 20)

      db.addNamedListener('dict.ttdict:update', async (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')

          let d = await db.dict.ttdict.get('b')
          assert.equal(d, undefined)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.delete('b')
    })
  })

  it('named listener dict.remove', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.dict.ttdict.set('b', 20)
      let d = await db.dict.ttdict.get('b')
      assert.equal(d, 20)

      db.addNamedListener('dict.ttdict:delete', async (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'delete')
          assert.equal(event.type, 'dict')
          assert.equal(event.name, 'ttdict')

          let d = await db.dict.ttdict.get('b')
          assert.equal(d, undefined)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.dict.ttdict.remove()
    })
  })
})
