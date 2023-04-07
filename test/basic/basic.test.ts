/**
 * basic.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

// import * as assert from 'assert'
import { assert } from 'chai'
import * as path from 'path'
// import PotDb from '../src'
import PotDb from '../../build'
import { db_path } from '../cfgs'

describe('basic', () => {
  it('basic test', async () => {
    const db = new PotDb(db_path)
    // console.log(db)
    assert(db.dir === db_path)
  })
})
