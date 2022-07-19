/**
 * dump_and_load.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
import fs from 'fs'
import path from 'path'
import settings from 'src/settings'
import { IDbDataJSON } from 'src/typings'
import PotDb from '../src'
// import PotDb from '../build'

describe('dump and load test', function () {
  this.timeout(settings.io_dump_delay * 2 + 2000)

  const tmp_dir = path.join(__dirname, 'tmp')
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

  it('dump test', async () => {
    const db = new PotDb(db_path, { debug })

    await db.dict.da.set('a', 1)
    await db.dict.da.set('b', 2)
    await db.dict.da2.set('a2', 11)
    await db.dict.da2.set('b2', '22')

    await db.list.l1.push('l11')
    await db.list.l1.push('l12')
    await db.list.l2.update(['l22', 'l23'])

    await db.set.s1.add('s11')
    await db.set.s1.add('s12')

    await db.collection.c1.insert({ c: 1 })
    await db.collection.c1.insert({ c: '2' })
    await db.collection.c2.insert({ c: 3 })
    await db.collection.c2.insert({ c: 4 })

    let data = await db.toJSON()
    assert(typeof data === 'object')
    assert(data.dict?.da.a === 1)
    assert(data.dict?.da.b === 2)
    assert(data.dict?.da2.a2 === 11)
    assert(data.dict?.da2.b2 === '22')
    assert(data.list?.l1.join('.') === 'l11.l12')
    assert(data.list?.l2.join('.') === 'l22.l23')
    assert(data.set?.s1.includes('s11'))
    assert(data.set?.s1.includes('s12'))
    // assert(data.collection?.c1.meta)
    assert(data.collection?.c1.data[0].c === 1)
    assert(data.collection?.c1.data[1].c === '2')
    assert(data.collection?.c2.data[0].c === 3)
    assert(data.collection?.c2.data[1].c === 4)
  })

  it('load test', async () => {
    const db = new PotDb(db_path, { debug })

    let data: IDbDataJSON = {
      dict: {
        a: { a1: 1, a2: 2 },
        b: { b1: 'B', b2: 'B2' },
      },
      list: {
        a: [1, 2, 3],
        b: ['a', 'b', 'c'],
      },
      set: {
        a: [1, 1, 2, 3],
        b: [1, '2', '5'],
      },
      collection: {
        a: {
          data: [
            { _id: '1', a: 1, b: 2 },
            { _id: '2', a: 2, b: 22 },
          ],
        },
        b: {
          data: [
            { _id: '1', x: 'X' },
            { _id: '2', y: 'Y' },
          ],
        },
      },
    }

    await db.loadJSON(data)

    assert((await db.dict.a.get('a1')) === 1)
    assert((await db.dict.a.get('a2')) === 2)
    assert((await db.dict.b.get('b1')) === 'B')
    assert((await db.dict.b.get('b2')) === 'B2')
    assert((await db.list.a.all())[0] === 1)
    assert((await db.list.a.all())[1] === 2)
    assert((await db.list.a.all())[2] === 3)
    assert((await db.list.b.all()).join('.') === 'a.b.c')
    assert(await db.set.a.has(1))
    assert(await db.set.a.has(2))
    assert(await db.set.a.has(3))
    assert(await db.set.b.has(1))
    assert(await db.set.b.has('2'))
    assert(await db.set.b.has('5'))
    assert((await db.collection.a.all<any>())[0].a === 1)
    assert((await db.collection.a.all<any>())[0].b === 2)
    assert((await db.collection.a.all<any>())[1].b === 22)
    assert((await db.collection.b.all<any>())[0].x === 'X')
    assert((await db.collection.b.all<any>())[1].y === 'Y')
  })

  it('collection meta test', async () => {
    const db = new PotDb(db_path, { debug })

    await db.collection.m1.insert({ a: 1 })
    await db.collection.m1.insert({ a: 2 })
    let meta = await db.collection.m1._getMeta()
    assert(meta.index === 2)

    await db.collection.m1._setMeta({ index: 10 })
    meta = await db.collection.m1._getMeta()
    assert(meta.index === 10)
    let d = await db.collection.m1.insert<any>({ a: 3 })
    assert(d._id === '11')

    let data = await db.toJSON()
    assert(data.collection?.m1.meta?.index === 11)

    await db.collection.m1.insert({})
    await db.collection.m1.insert({})
    await db.collection.m1.insert({})

    await db.loadJSON(data)
    meta = await db.collection.m1._getMeta()
    assert(meta.index === 11)
    let items = await db.collection.m1.all<any>()
    assert(items.length === 3)
    assert(items[2]?.a === 3)

    d = await db.collection.m1.insert({})
    assert(d._id === '12')
  })
})
