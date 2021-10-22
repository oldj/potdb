/**
 * @author: oldj
 * @homepage: https://oldj.net
 */

// import assert = require('assert')
import { assert } from 'chai'
import fs from 'fs'
import path from 'path'
import PotDb from '../src'
// import PotDb from '../build'

describe('bigdb test', () => {
  const db_path = path.join(__dirname, '../../../tmp/writer/db')
  if (!fs.existsSync(db_path)) {
    return
  }

  let db: PotDb

  beforeEach(() => {
    db = new PotDb(db_path)
  })

  const timer = async (name: string, fn: () => Promise<any>) => {
    let t0 = new Date().getTime()
    let r = await fn()
    let t1 = new Date().getTime()
    console.log(`time [${name}]: ${t1 - t0}ms, output: ${r}`)
    return r
  }

  it('basic', async () => {
    assert(db.dir === db_path)

    await timer('count doc tree', async () => (await db.list.doc_tree.all()).length)
    await timer('count board tree', async () => (await db.list.board_tree.all()).length)
    await timer('count items', async () => (await db.collection.items.all()).length)

    let id = '275bd2d8-f874-47f0-8cff-6288315c2fd1'
    await timer('get item', async () => {
      let item = await db.collection.items.find<any>((i) => i.id === id)
      return item?.id
    })
  })

  it('simple index', async () => {
    let id = '275bd2d8-f874-47f0-8cff-6288315c2fd1'
    await db.collection.items.addIndex('id')
    await timer('build index', async () => await db.collection.items.rebuildIndexes())
    await timer('count items', async () => (await db.collection.items.all()).length)
    assert.equal(
      await timer('get item', async () => {
        let item = await db.collection.items.find<any>((i) => i.id === id)
        return item?.id
      }),
      id,
    )
    // console.log(await db.collection.items.getIndexes())
    assert.equal(
      await timer('get item by index', async () => {
        let item = await db.collection.items.find<any>(['id', id])
        // console.log(item)
        return item?.id
      }),
      id,
    )
    assert.equal(
      await timer('get item by index again', async () => {
        let item = await db.collection.items.find<any>(['id', id])
        // console.log(item)
        return item?.id
      }),
      id,
    )
  })
})
