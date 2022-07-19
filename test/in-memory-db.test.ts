/**
 * in-memory-db.test.ts
 */

import { assert } from 'chai'
import PotDb from '../src'

describe('bigdb test', () => {
  it('basic', async () => {
    const db = new PotDb()

    await db.dict.tt.set('a', 1)
    assert((await db.dict.tt.get('a')) === 1)

    // console.log(await db.keys())
    let keys = await db.keys()
    assert(keys.dict.length === 1)
    assert(keys.dict.includes('tt'))

    // console.log(await db.toJSON())
    let data = await db.toJSON()
    assert(data.dict?.tt.a === 1)
  })

  it('test 2', async () => {
    const db = new PotDb()

    await db.dict.tt.set('a', 1)
    assert((await db.dict.tt.get('a')) === 1)

    await db.dict.tt2.set('b', 2)
    assert((await db.dict.tt2.get('b')) === 2)

    await db.list.a1.push(1)
    assert((await db.list.a1.all())[0] === 1)

    await db.list.a1.push(2)
    assert((await db.list.a1.all())[1] === 2)

    await db.set.s1.add('x')
    assert((await db.set.s1.has('x')) === true)

    await db.collection.c1.insert({ id: 1, a: 'AAA' })
    assert((await db.collection.c1.find<any>((i) => i.id === 1)).a === 'AAA')

    let data = await db.toJSON()
    // console.log(data)
    assert(data.dict?.tt.a === 1)
    assert(data.dict?.tt2.b === 2)
    assert(data.list?.a1.join(',') === '1,2')
    assert(data.set?.s1.join(',') === 'x')
    assert(data.collection?.c1.data[0].id === 1)
    assert(data.collection?.c1.data[0].a === 'AAA')
  })
})
