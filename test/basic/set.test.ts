/**
 * set.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import settings from '@/settings'
import fs from 'fs'
import path from 'path'
import PotDb from '@/index'
import { tmp_dir } from '../cfgs'

describe('set test', function () {
  this.timeout(settings.io_dump_delay * 2 + 2000)

  const debug = false
  let db_path = path.join(tmp_dir, 'set_test_db')

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

    assert(!(await db.set.abc.has('a')))
    await db.set.abc.add('a')
    assert(await db.set.abc.has('a'))
    await db.set.abc.add('a')
    await db.set.abc.add('a')
    await db.set.abc.add('b')
    assert(await db.set.abc.has('b'))
    let a = await db.set.abc.all()
    assert(Array.isArray(a))
    assert(a.length === 2)
    assert(a.includes('a'))
    assert(a.includes('b'))

    let s = db.set.abc
    await s.delete('a')
    assert(!(await db.set.abc.has('a')))
    assert(await db.set.abc.has('b'))
    await s.delete('b')
    assert(!(await db.set.abc.has('b')))
    await s.delete('c')
    assert(!(await db.set.abc.has('c')))

    await s.add(2)
    assert(await db.set.abc.has(2))
    await s.set([3, 1, 1, 4])
    assert(!(await db.set.abc.has(2)))
    assert(await db.set.abc.has(3))
    assert(await db.set.abc.has(1))
    assert(await db.set.abc.has(4))

    assert((await db.keys()).set.join('.') === 'abc')
  })

  it('set persistent test', async () => {
    const db = new PotDb(db_path, { debug })
    db.set.persistent_test.add('a111')

    await new Promise((resolve) => setTimeout(resolve, settings.io_dump_delay * 2))

    const db2 = new PotDb(db_path, { debug })
    assert(await db2.set.persistent_test.has('a111'))
  })
})
