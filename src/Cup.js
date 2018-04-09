/**
 * Cup.js
 */

'use strict'

const fs = require('fs')
const util = require('util')
const {EOL} = require('os')
const readline = require('readline')
const stream = require('stream')
const isSimpleObject = require('./libs/isSimpleObject')
//const waitUntil = require('./libs/waitUntil')
const appendFile = util.promisify(fs.appendFile)
const unlink = util.promisify(fs.unlink)
const rename = util.promisify(fs.rename)

const action_del = '$$_DEL_$$'

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

    switch (key) {
      case action_del:
        delete this._data[value]
        return
    }

    try {
      this._data[key] = value ? JSON.parse(value) : ''
    } catch (e) {
      console.log(e)
    }
  }

  _load () {
    return new Promise((resolve) => {
      this._data = {}

      let instream = fs.createReadStream(this.fn)
      let outstream = new stream()
      let rl = readline.createInterface(instream, outstream)

      rl.on('line', (line) => {
        this._parseLine(line)
      })

      rl.on('close', () => {
        this._is_loaded = true
        resolve()
      })
    })
  }

  isChanged () {
    return this._is_changed
  }

  async getItem (key, force = false) {
    if (force || !this._is_loaded) {
      await this._load()
    }
    return this._data[key.toString()]
  }

  async getItems (keys, force = false) {
    if (force) {
      await this._load()
    }
    return await Promise.all(keys.map(async k => await this.getItem(k)))
  }

  async getAll (force = false) {
    if (force || !this._is_loaded) {
      await this._load()
    }

    return Object.assign({}, this._data)
  }

  async getKeys () {
    if (!this._is_loaded) {
      await this._load()
    }

    return Object.keys(this._data)
  }

  async _setItem (key, value) {
    if (!isSimpleObject(value)) {
      throw 'value must be a simple object.'
    }

    this._data[key] = value
    this._is_changed = true
    let d = JSON.stringify(value)
    await appendFile(this.fn, `${EOL}${key}=${d}`, 'utf-8')
  }

  async setItem (key, value) {
    key = key.toString()
    if (!key || key.indexOf('=') > -1 || /^\$\$_\w+_\$\$$/.test(key)) {
      throw `bad key [${key}].`
    }

    await this._setItem(key, value)
  }

  async setItems (obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        await this.setItem(key, obj[key])
      }
    }
  }

  /**
   * remove key or keys
   * @param key {String|Array<String>}
   * @returns {Promise<void>}
   */
  async remove (key) {
    if (!this._is_loaded) {
      await this._load()
    }

    const delOne = async (k) => {
      delete this._data[k]
      await this._setItem(action_del, k)
    }

    if (Array.isArray(key)) {
      await Promise.all(key.map(async k => await delOne(k)))
    } else {
      await delOne(key)
    }
  }

  /**
   * find records
   * @param filter {Function}
   * @param force {Boolean}
   * @returns {Promise<Array>}
   */
  async find (filter, force = false) {
    if (force || !this._is_loaded) {
      await this._load()
    }

    let result = []
    for (let key in this._data) {
      let value = this._data[key]
      if (this._data.hasOwnProperty(key) && filter(key, value)) {
        result.push({key, value})
      }
    }

    return result
  }

  async dump () {
    if (this._is_dumping) return
    this._is_dumping = true

    if (!this._is_loaded) {
      let d0 = Object.assign({}, this._data)
      await this._load()
      Object.assign(this._data, d0)
    }

    this._is_changed = false

    let keys = Object.keys(this._data)
    if (keys.length === 0) return
    keys = keys.sort()

    let fn_tmp = [this.fn, (new Date()).getTime(), Math.floor(Math.random() * 1000), 'tmp'].join('.')
    await Promise.all(keys.map(async key => {
      let value = this._data[key]
      let d = JSON.stringify(value)
      await appendFile(fn_tmp, `${key}=${d}${EOL}`, 'utf-8')
    }))

    let backup_fn = this.fn + '.backup'

    if (fs.existsSync(backup_fn)) {
      await unlink(backup_fn)
    }

    if (fs.existsSync(this.fn)) {
      await rename(this.fn, backup_fn)
    }
    await rename(fn_tmp, this.fn)

    if (fs.existsSync(backup_fn)) {
      await unlink(backup_fn)
    }

    this._is_dumping = false
  }

  async close () {
    await this.dump()
    this._data = {}
    this._is_loaded = false
  }
}

module.exports = Cup
