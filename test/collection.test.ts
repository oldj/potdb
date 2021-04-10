/**
 * collection.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import assert = require('assert')
import settings from '@/settings'
import fs from 'fs'
import path from 'path'
import LatDb from '../src'

// import LatDb from '../build'

interface ITestDoc1 {
  _id?: string;
  title: string;
  content: string;
}

describe('collection test', function () {
  this.timeout(30 * 1e3)

  const tmp_dir = path.join(__dirname, 'tmp')
  const debug = false
  let db_path = path.join(tmp_dir, 'collection_test_db')

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
    const db = new LatDb(db_path, { debug })

    await db.collection.test.insert<ITestDoc1>({
      title: 'Test',
      content: 'this is content',
    })
    await db.collection.test.insert<ITestDoc1>({
      title: 'Title 2',
      content: 'content 2',
    })

    let records = await db.collection.test.all()
    assert(Array.isArray(records) && records.length === 2)
    assert(records[0]._id === '1')

    records = await db.collection.test.all([ 'title' ])
    assert(Array.isArray(records) && records.length === 2)
    assert(!records[0]._id && !records[1]._id)
    assert(records[0].title === 'Test')
    assert(!records[0].content)

    let doc = await db.collection.test.find<ITestDoc1>(i => i._id === '1')
    assert(doc && doc.title === 'Test')

    doc.title = 'ttt'
    let doc2 = await db.collection.test.find<ITestDoc1>(i => i._id === '1')
    assert(doc2 && doc2.title === 'Test')
    // @ts-ignore
    await db.collection.test.update(i => i._id === doc2._id, { title: 'ttt2' })

    await new Promise(resolve => setTimeout(resolve, settings.io_dump_delay * 2))

    let doc3 = await db.collection.test.find<ITestDoc1>(i => !!doc2 && i._id === doc2._id)
    assert(doc3 && doc3.title === 'ttt2')

    doc = await db.collection.test.find<ITestDoc1>(i => i._id === '1', [ '_id' ])
    assert(doc && !doc.title)

    let docs = await db.collection.test.filter<ITestDoc1>(i => i._id === '1')
    assert(Array.isArray(docs) && docs.length === 1 && docs[0].title === 'ttt2')

    docs = await db.collection.test.filter<ITestDoc1>(i => i._id === '1', [ 'title' ])
    assert(Array.isArray(docs) && docs.length === 1 && docs[0].title === 'ttt2')
    assert(!docs[0]._id && !docs[0].content)

    assert((await db.keys()).collection.join('.') === 'test')
  })

  it('delete item', async () => {
    const db = new LatDb(db_path, { debug })

    await db.collection.rm_test_1.insert({ a: 1 })
    await db.collection.rm_test_1.insert({ a: 2 })
    await db.collection.rm_test_1.insert({ a: 3 })
    await db.collection.rm_test_1.insert({ a: 4 })
    assert((await db.collection.rm_test_1.count()) === 4)

    let d = await db.collection.rm_test_1.index<any>(2)
    assert(d && d.a === 3)
    // @ts-ignore
    await db.collection.rm_test_1.delete(i => i._id === d._id)

    assert((await db.collection.rm_test_1.count()) === 3)
    d = await db.collection.rm_test_1.index(2)
    assert(d && d.a === 4)
  })
})
