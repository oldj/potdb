/**
 * Cup.js
 */

'use strict'

const fs = require('fs')
const util = require('util')
const {EOL} = require('os')
const isSimpleObject = require('./libs/isSimpleObject')
const readline = require('readline')
const stream = require('stream')
const appendFile = util.promisify(fs.appendFile)
const unlink = util.promisify(fs.unlink)
const rename = util.promisify(fs.rename)

class Cup {
  constructor (fn, options = {}) {
    this.fn = fn
    this.options = Object.assign({}, options)

    this._data = {}
    this._is_loaded = false
    this._is_dumping = false
    this._is_changed = false
  }

  _parseLine (line) {
    line = line.replace(/^\s+|\s+$/g, '')
    let idx = line.indexOf('=')
    if (idx === -1) return

    let key = line.substring(0, idx)
    let value = line.substring(idx + 1)

    try {
      this._data[key] = value ? JSON.parse(value) : ''
    } catch (e) {
      console.log(e)
    }
  }

  _load () {
    return new Promise((resolve) => {
      let instream = fs.createReadStream(this.fn)
      let outstream = new stream()
      let rl = readline.createInterface(instream, outstream)

      rl.on('line', (line) => {
        this._parseLine(line)
      })

      rl.on('close', () => {
        resolve()
      })
    })
  }

  async getItem (key) {
    if (!this._is_loaded) {
      await this._load()
      this._is_loaded = true
    }
    return this._data[key.toString()]
  }

  async setItem (key, value) {
    if (!isSimpleObject(value)) {
      throw 'value must be a simple object.'
    }

    key = key.toString()
    this._data[key] = value
    this._is_changed = true
    let d = JSON.stringify(value)
    await appendFile(this.fn, `${EOL}${key}=${d}`, 'utf-8')
  }

  async dump () {
    if (this._is_dumping) return
    this._is_dumping = true
    this._is_changed = false

    let keys = Object.keys(this._data)
    if (keys.length === 0) return
    keys = keys.sort()
    console.log(keys)

    let fn_tmp = [this.fn, (new Date()).getTime(), Math.floor(Math.random() * 1000), 'tmp'].join('.')
    keys.map(async key => {
      let value = this._data[key]
      let d = JSON.stringify(value)
      await appendFile(fn_tmp, `${key}=${d}${EOL}`, 'utf-8')
    })

    if (fs.existsSync(this.fn)) {
      console.log('to remove', this.fn)
      await unlink(this.fn)
    }
    await rename(fn_tmp, this.fn)

    this._is_dumping = false
  }

  async close () {
    await this.dump()
    this._data = {}
    this._is_loaded = false
  }
}

module.exports = Cup
