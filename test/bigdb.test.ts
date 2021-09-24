/**
 * @author: oldj
 * @homepage: https://oldj.net
 */

import assert = require('assert')
import path from 'path'
import PotDb from '../src'
// import PotDb from '../build'

describe.skip('bigdb test', () => {
  const db_path = path.join(__dirname, '../../../tmp/writer/db')
  let db: PotDb

  beforeEach(() => {
    db = new PotDb(db_path)
  })

  const timer = async (name: string, fn: () => Promise<any>) => {
    let t0 = (new Date()).getTime()
    let r = await fn()
    let t1 = (new Date()).getTime()
    console.log(`time [${name}]: ${t1 - t0}ms, output: ${r}`)
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
})