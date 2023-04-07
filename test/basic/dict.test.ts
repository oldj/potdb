/**
 * dict.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import * as fs from 'fs'
import * as path from 'path'
import PotDb from '@/index'
import settings from '@/settings'
import { tmp_dir } from '../cfgs'

describe('dict test', function () {
  this.timeout(settings.io_dump_delay * 2 + 2000)

  const debug = false
  let db_path = path.join(tmp_dir, 'dict_test_db')

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

    // assert(await db.dict.abc.get('a') === 'AA')
    // assert(await db.dict.abc.get('a', 'a1') === 'a1')

    await db.dict.abc.set('a', 1)
    // assert(await db.dict.abc.get('a') === undefined)
    assert((await db.dict.abc.get('a')) === 1)
    assert((await db.dict['abc'].get('a')) === 1)
    await db.dict['abc'].set('a', 'AA')
    assert((await db.dict.abc.get('a')) === 'AA')
    assert((await db.dict['abc'].get('a')) === 'AA')

    await db.dict.abc.set('b', 33)
    assert((await db.dict.abc.get('b')) === 33)
    assert((await db.dict.abc.keys()).join(':') === 'a:b')

    const db2 = new PotDb(db_path, { debug })
    let d = db2.dict.abc2
    await d.set('bb', 'BB')
    let keys = await d.keys()
    assert(keys.includes('bb'))
    await d.delete('bb')
    keys = await d.keys()
    assert(!keys.includes('bb'))

    assert((await db.keys()).dict.join('.') === 'abc.abc2')
    assert((await db2.keys()).dict.join('.') === 'abc.abc2')
  })

  it('set persistent test', async () => {
    const db = new PotDb(db_path, { debug })
    await db.dict.persistent_test.set('a111', 111)

    await new Promise((resolve) => setTimeout(resolve, settings.io_dump_delay * 2))

    const db2 = new PotDb(db_path, { debug })
    assert((await db2.dict.persistent_test.get('a111')) === 111)
  })

  it('clone test', async () => {
    const db = new PotDb(db_path, { debug })

    let v = { a: 1 }
    await db.dict.cc.set('a', v)
    v.a = 2
    let b = await db.dict.cc.get<any>('a')
    assert(b.a === 1)

    b.a = 2
    let c = await db.dict.cc.get<any>('a')
    assert(c.a === 1)
  })

  it('remove test', async () => {
    const db = new PotDb(db_path, { debug })
    await db.dict.remove_test.set('a', 1)
    await new Promise((resolve) => setTimeout(resolve, settings.io_dump_delay * 2))
    await db.dict.remove_test.remove()

    const db2 = new PotDb(db_path, { debug })
    let a = await db2.dict.remove_test.get('a')
    assert(!a)
  })

  // it.only('tmp test', async () => {
  //   const db = new PotDb(db_path, { debug })
  //   db.dict.cc.set('a', 1)
  //   db.dict.cc.get('a').then(v => console.log(v))
  //   // assert(await db.dict.cc.get('a') === 1)
  // })
})
