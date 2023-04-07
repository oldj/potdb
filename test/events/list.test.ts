/**
 * list.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as path from 'path'
import PotDb from '@/index'

describe('events.list', () => {
  const db_path = path.join(path.dirname(__dirname), 'tmp')
  const db = new PotDb(db_path)

  beforeEach(async () => {
    await db.list.ttlist.clear()
    assert.equal((await db.list.ttlist.all()).length, 0)
  })

  afterEach(async () => {
    db.clearListeners()
  })

  it('list.rpush', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value[event.value.length - 1], 123)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.rpush(123)
    })
  })

  it('list.lpush', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value[0], 123)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.lpush(123)
    })
  })

  it('list.push', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value[event.value.length - 1], 128)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.push(128)
    })
  })

  it('list.rpop', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.rpush(22)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.notEqual(event.value[event.value.length - 1], 22)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      assert.equal(await db.list.ttlist.rpop(), 22)
    })
  })

  it('list.lpop', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.lpush(21)
      await db.list.ttlist.lpush(22)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.notEqual(event.value[0], 22)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      assert.equal(await db.list.ttlist.lpop(), 22)
    })
  })

  it('list.pop', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.rpush(25)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.notEqual(event.value[event.value.length - 1], 25)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      assert.equal(await db.list.ttlist.pop(), 25)
    })
  })

  it('list.rextend', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.rpush('x')

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), 'x,a,b,c')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.rextend('a', 'b', 'c')
    })
  })

  it('list.lextend', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.rpush('x')

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), 'a,b,c,x')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.lextend('a', 'b', 'c')
    })
  })

  it('list.extend', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.push('x')

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), 'x,a,b,c')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.extend('a', 'b', 'c')
    })
  })

  it('list.splice', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.extend('a', 'b', 'c', 'x')

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), 'a,o,p,x')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.splice(1, 2, 'o', 'p')
    })
  })

  it('list.delete', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.extend(1, 2, 3, 4, 5)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), '1,3,5')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.delete((i) => i % 2 === 0)
    })
  })

  it('list.set', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.extend(1, 2, 3, 4, 5)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), 'a,b,c')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.set(['a', 'b', 'c'])
    })
  })

  it('list.clear', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.set([1, 2, 3, 4, 5])
      assert.equal((await db.list.ttlist.all()).length, 5)

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.length, 0)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.clear()
    })
  })

  it('list.remove', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.set([1, 2, 3, 4, 5])
      assert.equal((await db.list.ttlist.all()).length, 5)

      db.addListener(async (event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'delete')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          let all = await db.list.ttlist.all()
          assert.equal(all.length, 0)
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.remove()
    })
  })

  it('list.update', (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      await db.list.ttlist.set([1, 2, 3, 4, 5])

      db.addListener((event) => {
        try {
          // console.log(event)
          assert.equal(event.action, 'update')
          assert.equal(event.type, 'list')
          assert.equal(event.name, 'ttlist')
          assert.equal(event.value.join(','), 'a,b,c')
        } catch (e) {
          reject(e)
          return
        }

        resolve()
      })

      await db.list.ttlist.update(['a', 'b', 'c'])
    })
  })
})
