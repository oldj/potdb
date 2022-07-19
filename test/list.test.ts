/**
 * list.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import settings from '@/settings'
import fs from 'fs'
import path from 'path'
import PotDb from '../src'
import List from '@/core/type/list'

describe('list test', function () {
  this.timeout(settings.io_dump_delay * 2 + 2000)

  const tmp_dir = path.join(__dirname, 'tmp')
  const debug = false
  let db_path = path.join(tmp_dir, 'list_test_db')

  before(async () => {
    await fs.promises.mkdir(tmp_dir, { recursive: true })
  })

  after(async () => {
    // (new Promise(resolve => setTimeout(resolve, settings.io_dump_delay * 2)))
    //   .then(() => {
    //     fs.existsSync(db_path) && fs.rmdirSync(db_path, { recursive: true })
    //   })
  })

  it('basic test', async () => {
    const db = new PotDb(db_path, { debug })
    // console.log(db)
    assert(db.dir === db_path)

    assert((await db.list.abc.all()).length === 0)
    await db.list.abc.push('123')
    assert((await db.list.abc.all()).length === 1)
    let a = db.list.abc
    await a.push(456)
    assert((await db.list.abc.all()).length === 2)
    let b = await a.pop()
    assert((await db.list.abc.all()).length === 1)
    assert(b === 456)

    await a.lpush('000')
    assert((await db.list.abc.all()).length === 2)
    assert((await db.list.abc.index(0)) === '000')
    await a.lpop()
    assert((await a.all()).length === 1)

    await a.rpush('22')
    assert((await db.list.abc.all()).length === 2)
    assert((await db.list.abc.index(0)) === '123')
    assert((await db.list.abc.index(1)) === '22')
    assert((await db.list.abc.index(2)) === undefined)
    assert((await db.list.abc.index(-1)) === '22')
    assert((await db.list.abc.index(-2)) === '123')
    assert((await db.list.abc.index(-3)) === undefined)

    b = await a.rpop()
    assert(b === '22')
    assert((await db.list.abc.all()).length === 1)
    assert((await db.list.abc.index(0)) === '123')

    let a2: List = db.list.a2
    await a2.extend(1, 2, 3, 4, 5)
    assert((await a2.all()).length === 5)
    await a2.push({ x: 1, y: 2 })
    assert((await a2.all()).length === 6)
    assert((await a2.find((item) => item.x === 1)).y === 2)
    assert((await a2.filter((item) => typeof item === 'number')).length === 5)

    assert((await a2.slice(0, 3)).join('.') === '1.2.3')
    b = await a2.splice(2, 2)
    assert(b.join('.') === '3.4')
    await a2.splice(2, 2, '6', '7', '8', '9', '10')
    assert((await a2.all()).length === 7)
    assert((await a2.index(-1)) === '10')

    await a2.clear()
    assert((await a2.all()).length === 0)

    await a2.push(10)
    await a2.lextend(6, 7, 8, 9)
    assert((await a2.all()).join('.') === '6.7.8.9.10')
    assert((await a2.map((i) => i * 2)).join('.') === '12.14.16.18.20')

    await a2.set([3, 1, 4])
    assert((await a2.all()).join('.') === '3.1.4')

    b = await a2.delete((i) => i <= 3)
    assert((await a2.all()).join('.') === '4')
    assert(b.length === 1 && b[0] === 4)

    assert((await db.keys()).list.join('.') === 'a2.abc')
  })

  it('list persistent test', async () => {
    const db = new PotDb(db_path, { debug })
    db.list.persistent_test.rextend(1, 2, 3, 4, 5, '6')

    await new Promise((resolve) => setTimeout(resolve, settings.io_dump_delay * 2))

    const db2 = new PotDb(db_path, { debug })
    assert((await db2.list.persistent_test.all()).join('.') === '1.2.3.4.5.6')
  })
})
