/**
 * basic.test.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

// import * as assert from 'assert'
import assert = require('assert')
import * as path from 'path'
// import PotDb from '../src'
import PotDb from '../build'

describe('basic', () => {
  it('basic test', async () => {
    const db_path = path.join(__dirname, 'tmp')
    const db = new PotDb(db_path)
    // console.log(db)
    assert(db.dir === db_path)
  })
})
