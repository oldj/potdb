/**
 * collection.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import settings from '@/settings'
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'
import { removeDir } from '@/utils/fs2'
import PotDb from '@/index'
import { tmp_dir } from '../cfgs'
import { getJSONFiles } from '@/utils/getJSONFiles'

// import PotDb from '../build'

interface ITestDoc1 {
  _id?: string
  title: string
  content: string
}

describe.only('collection test', function () {
  this.timeout(30 * 1e3)

  const debug = false
  let db_path = path.join(tmp_dir, 'collection_test_db')
  let db: PotDb

  beforeEach(async () => {
    db = new PotDb(db_path, { debug })
    await fs.promises.mkdir(tmp_dir, { recursive: true })
  })

  afterEach(async () => {
    await removeDir(db_path)
    // (new Promise(resolve => setTimeout(resolve, settings.io_dump_delay * 2)))
    //   .then(() => {
    //     fs.existsSync(db_path) && fs.rmdirSync(db_path, { recursive: true })
    //   })
  })

  it('basic test', async () => {
    await db.collection.test.insert<ITestDoc1>({
      title: 'Test',
      content: 'this is content',
    })
    await db.collection.test.insert<ITestDoc1>({
      title: 'Title 2',
      content: 'content 2',
    })

    let records = await db.collection.test.all<ITestDoc1>()
    assert(Array.isArray(records) && records.length === 2)
    assert(records[0]._id === '1')

    records = await db.collection.test.all(['title'])
    assert(Array.isArray(records) && records.length === 2)
    assert(!records[0]._id && !records[1]._id)
    assert(records[0].title === 'Test')
    assert(!records[0].content)

    let doc = await db.collection.test.find<ITestDoc1>((i) => i._id === '1')
    assert.notEqual(doc, undefined)
    if (!doc) {
      throw new Error('doc is undefined')
    }
    assert(doc.title === 'Test')

    doc.title = 'ttt'
    let doc2 = await db.collection.test.find<ITestDoc1>((i) => i._id === '1')
    assert(doc2 && doc2.title === 'Test')
    // @ts-ignore
    await db.collection.test.update((i) => i._id === doc2._id, { title: 'ttt2' })

    await new Promise((resolve) => setTimeout(resolve, settings.io_dump_delay * 2))

    let doc3 = await db.collection.test.find<ITestDoc1>((i) => !!doc2 && i._id === doc2._id)
    assert(doc3 && doc3.title === 'ttt2')

    doc = await db.collection.test.find<ITestDoc1>((i) => i._id === '1', ['_id'])
    assert(doc && !doc.title)

    let docs = await db.collection.test.filter<ITestDoc1>((i) => i._id === '1')
    assert(Array.isArray(docs) && docs.length === 1 && docs[0].title === 'ttt2')

    docs = await db.collection.test.filter<ITestDoc1>((i) => i._id === '1', ['title'])
    assert(Array.isArray(docs) && docs.length === 1 && docs[0].title === 'ttt2')
    assert(!docs[0]._id && !docs[0].content)

    assert((await db.keys()).collection.join('.') === 'test')
  })

  it('delete item', async () => {
    await db.collection.rm_test_1.insert({ a: 1 })
    await db.collection.rm_test_1.insert({ a: 2 })
    await db.collection.rm_test_1.insert({ a: 3 })
    await db.collection.rm_test_1.insert({ a: 4 })
    assert((await db.collection.rm_test_1.count()) === 4)

    let d = await db.collection.rm_test_1.index<any>(2)
    assert(d && d.a === 3)
    // @ts-ignore
    await db.collection.rm_test_1.delete((i) => i._id === d._id)

    assert((await db.collection.rm_test_1.count()) === 3)
    d = await db.collection.rm_test_1.index(2)
    assert(d && d.a === 4)
  })

  it('index test 1', async () => {
    const db1 = new PotDb(path.join(db_path, '1'), { debug })

    await db1.collection.tt.addIndex('id')
    await db1.collection.tt.insert({ id: 'aa1', a: 1 })
    await db1.collection.tt.insert({ id: 'aa2', a: 22 })
    let indexes = await db1.collection.tt.getIndexes()
    // console.log(indexes)

    let d = await db1.collection.tt.find<any>(['id', 'aa2'])
    assert((await d.a) === 22)
    await db1.collection.tt.addIndex('id')
    d = await db1.collection.tt.find<any>(['id', 'aa3'])
    assert(d === undefined)

    await db1.collection.tt.all()
    indexes = await db1.collection.tt.getIndexes()

    let data = await db1.toJSON()

    const db2 = new PotDb(path.join(db_path, '2'), { debug })
    await db2.loadJSON(data)
    await db2.collection.tt.addIndex('id')
    indexes = await db2.collection.tt.getIndexes()
    // console.log(indexes)
    // let all = await db2.collection.tt.all()
    await db2.collection.tt.rebuildIndexes()
    indexes = await db2.collection.tt.getIndexes()
    // console.log(indexes)

    await db2.collection.tt.addIndex('id')
    d = await db2.collection.tt.find<any>(['id', 'aa1'])
    assert((await d.a) === 1)
    d = await db2.collection.tt.find<any>(['id', 'aa2'])
    assert((await d.a) === 22)
    d = await db2.collection.tt.find<any>(['id', 'aa3'])
    assert(d === undefined)
  })

  it('index test 2', async () => {
    await db.collection.tt.remove()
    await db.collection.tt.addIndex('type')
    await db.collection.tt.insert({ type: 'a', a: 1 })
    await db.collection.tt.insert({ type: 'a', a: 22 })
    await db.collection.tt.insert({ type: 'b', a: 23 })
    await db.collection.tt.insert({ type: 'b', a: 24 })
    await db.collection.tt.insert({ type: 'b', a: 25 })
    await db.collection.tt.insert({ type: 'c', a: 29 })

    let items = await db.collection.tt.filter<any>(['type', 'a'])
    assert(items.length === 2)
    items.sort((a, b) => a.a - b.a)
    assert((await items[0].a) === 1)
    assert((await items[1].a) === 22)

    items = await db.collection.tt.filter<any>(['type', 'b'])
    assert(items.length === 3)
    items.sort((a, b) => a.a - b.a)
    assert((await items[0].a) === 23)
    assert((await items[1].a) === 24)
    assert((await items[2].a) === 25)

    items = await db.collection.tt.all()
    assert.equal(items.length, 6)
    await db.collection.tt.delete(['type', 'b'])
    items = await db.collection.tt.all()
    assert.equal(items.length, 3)

    let indexes = await db.collection.tt.getIndexes()
    // console.log(indexes)
    assert.equal(typeof indexes['type'], 'object')
    assert.isTrue('a' in indexes['type'])
    assert.isFalse('b' in indexes['type'])
    assert.isTrue('c' in indexes['type'])

    let item = await db.collection.tt.find(['type', 'b'])
    assert.equal(item, undefined)
  })

  it('dump with index', async () => {
    await db.collection.tt.addIndex('id')
    await db.collection.tt.insert({ id: 'aa1', a: 1 })
    await db.collection.tt.insert({ id: 'aa2', a: 22 })

    let data = await db.toJSON()
    assert.equal(data.collection?.tt.index_keys?.join(''), 'id')

    let dir = path.join(db_path, '203')
    await removeDir(dir)
    const db2 = new PotDb(dir, { debug })
    let indexes = await db2.collection.tt.getIndexes()
    // console.log(indexes)
    assert.isFalse('id' in indexes)
    assert.equal(Object.keys(indexes).length, 0)

    await db2.loadJSON(data)
    indexes = await db2.collection.tt.getIndexes()
    // console.log(indexes)
    assert.isTrue('id' in indexes)
    assert.equal(indexes.id.aa1.join(''), '1')
    assert.equal(indexes.id.aa2.join(''), '2')
  })

  it('unmatched meta index', async () => {
    await db.collection.tt.insert({ id: 'aa1', a: 1 })
    await db.collection.tt.insert({ id: 'aa2', a: 22 })

    assert.equal((await db.collection.tt._getMeta()).index, 2)
    await db.collection.tt._setMeta({ index: 1 })
    assert.equal((await db.collection.tt._getMeta()).index, 1)

    if (!db.dir) throw new Error('db.dir is undefined')
    let tt_dir = path.join(db.dir, 'collection', 'tt')
    assert.isTrue(fs.existsSync(tt_dir) && fs.statSync(tt_dir).isDirectory())
    let tt_data_dir = path.join(tt_dir, 'data')
    let fns = await getJSONFiles(tt_data_dir)
    assert.equal(fns.length, 2)

    // console.log('-----')
    const db2 = new PotDb(db.dir, { debug })
    // await db2.collection.tt.checkMeta()
    assert.equal((await db2.collection.tt._getMeta()).index, 2)

    let d = await db2.collection.tt.insert({ id: 'aa3', a: 33 })
    assert.equal(d.a, 33)
    assert.equal(d._id, '3')

    await db2.collection.tt._setMeta({ index: 1 })
    d = await db2.collection.tt.insert({ id: 'aa4', a: 44 })
    assert.equal(d.a, 44)
    assert.equal(d._id, '2')

    const db3 = new PotDb(db.dir, { debug })
    d = await db3.collection.tt.insert({ id: 'aa5', a: 55 })
    assert.equal(d.a, 55)
    assert.equal(d._id, '4')
  })

  it('unmatched _ids', async () => {})
})
