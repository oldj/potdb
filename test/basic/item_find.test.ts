/**
 * basic.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { assert } from 'chai'
// import PotDb from '../src'
import PotDb from '../../build'
import { db_path } from '../cfgs'

describe.only('item find', () => {
  it('basic', async () => {
    const db = new PotDb(db_path)

    await db.collection.items.addIndex('id')
    await db.collection.items.insert({ id: 'id1', title: 'a' })
    await db.collection.items.insert({ id: 'id2', title: 'b' })

    let item: any = await db.collection.items.find(['id', 'id1'])
    assert(item?.title === 'a')
    item = await db.collection.items.find(['id', 'id2'])
    assert(item?.title === 'b')

    item = await db.collection.items.find(['id', 'id3'])
    assert(item === undefined)
  })
})
