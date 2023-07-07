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
    await db.set.ttset.clear()
    assert.equal((await db.set.ttset.all()).length, 0)
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

  it('set.set change', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let n = 0

      db.addListener((event) => {
        if (event.action === 'update' && event.type === 'set' && event.name === 'ttset') {
          n++
        }
      })

      await db.set.ttset.set(['abc', 'def', 'ghi'])
      await db.set.ttset.set(['abc', 'def', 'ghi', 12])

      setTimeout(() => {
        if (n === 2) {
          resolve()
        } else {
          reject()
        }
      }, 200)
    })
  })

  it('set.set not change', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let n = 0

      db.addListener((event) => {
        if (event.action === 'update' && event.type === 'set' && event.name === 'ttset') {
          n++
        }
      })

      await db.set.ttset.set(['abc', 'def', 'ghi'])
      await db.set.ttset.set(['abc', 'def', 'ghi', 12])
      await db.set.ttset.set(['abc', 'def', 'ghi', 12])
      await db.set.ttset.set([12, 'abc', 'def', 'ghi'])

      setTimeout(() => {
        if (n === 2) {
          resolve()
        } else {
          reject()
        }
      }, 200)
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

  it('set.update change', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let n = 0

      db.addListener((event) => {
        if (event.action === 'update' && event.type === 'set' && event.name === 'ttset') {
          n++
        }
      })

      await db.set.ttset.update(['abc', 'def', 'ghi'])
      await db.set.ttset.update(['abc', 'def', 'ghi', 12])

      setTimeout(() => {
        if (n === 2) {
          resolve()
        } else {
          reject()
        }
      }, 200)
    })
  })

  it('set.update not change', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      let n = 0

      db.addListener((event) => {
        if (event.action === 'update' && event.type === 'set' && event.name === 'ttset') {
          n++
        }
      })

      await db.set.ttset.update(['abc', 'def', 'ghi'])
      await db.set.ttset.update(['abc', 'def', 'ghi', 12])
      await db.set.ttset.update(['abc', 'def', 'ghi', 12])
      await db.set.ttset.update([12, 'abc', 'def', 'ghi'])

      setTimeout(() => {
        if (n === 2) {
          resolve()
        } else {
          reject()
        }
      }, 200)
    })
  })
})
