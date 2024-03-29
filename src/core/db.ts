/**
 * db
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'
import * as path from 'path'
import settings from '@/settings'
import { DataTypeDocument, IBasicOptions, IDbDataJSON } from '@/types/basic'
import getKeys, { IKeys } from './keys'
import Collection from './datatype/collection'
import Dict from './datatype/dict'
import List from './datatype/list'
import PotSet from './datatype/set'
import { DataEvent, DataEventListenerFunction } from '@/types/event'
import { makeEventName } from '@/utils/tools'

interface IDBOptions extends IBasicOptions {}

export default class PotDb {
  dir: string | null | undefined // null or undefined means in-memory db
  options: IDBOptions
  dict: { [key: string]: Dict }
  list: { [key: string]: List }
  set: { [key: string]: PotSet }
  collection: { [key: string]: Collection }
  private _dict: { [key: string]: Dict } = {}
  private _list: { [key: string]: List } = {}
  private _set: { [key: string]: PotSet } = {}
  private _collection: { [key: string]: Collection } = {}
  private _is_loading: boolean = false
  private _listeners: DataEventListenerFunction[] = []
  private _named_listeners: Record<string, DataEventListenerFunction[]> = {}

  constructor(root_dir?: string | null, options?: Partial<IDBOptions>) {
    // if (!fs.existsSync(path) || !fs.statSync(path).isDirectory()) {
    //   throw new Error(`'${path}' is not a directory.`)
    // }
    const debug = options?.debug || false
    if (debug) {
      console.log(`[potdb] open potdb: "${root_dir}"`)
    }

    this.dir = root_dir
    this.options = { ...this.getDefaultOptions(), ...options }

    this.dict = new Proxy(
      {},
      {
        get: (target: {}, key: PropertyKey, receiver: any): Dict => {
          let name: string = key.toString()
          if (!this._dict.hasOwnProperty(name)) {
            this._dict[name] = new Dict(
              this,
              name,
              this.dir ? path.join(this.dir, 'dict') : null,
              this.options,
            )
          }

          return this._dict[name]
        },
        ownKeys: (target) => {
          return Object.keys(this._dict)
        },
        getOwnPropertyDescriptor(target, prop) {
          return {
            enumerable: true,
            configurable: true,
          }
        },
      },
    )

    this.list = new Proxy(
      {},
      {
        get: (target: {}, key: PropertyKey, receiver: any): List => {
          let name: string = key.toString()
          if (!this._list.hasOwnProperty(name)) {
            this._list[name] = new List(
              this,
              name,
              this.dir ? path.join(this.dir, 'list') : null,
              this.options,
            )
          }

          return this._list[name]
        },
        ownKeys: (target) => {
          return Object.keys(this._list)
        },
        getOwnPropertyDescriptor(target, prop) {
          return {
            enumerable: true,
            configurable: true,
          }
        },
      },
    )

    this.set = new Proxy(
      {},
      {
        get: (target: {}, key: PropertyKey, receiver: any): PotSet => {
          let name: string = key.toString()
          if (!this._set.hasOwnProperty(name)) {
            this._set[name] = new PotSet(
              this,
              name,
              this.dir ? path.join(this.dir, 'set') : null,
              this.options,
            )
          }

          return this._set[name]
        },
        ownKeys: (target) => {
          return Object.keys(this._set)
        },
        getOwnPropertyDescriptor(target, prop) {
          return {
            enumerable: true,
            configurable: true,
          }
        },
      },
    )

    this.collection = new Proxy(
      {},
      {
        get: (target: {}, key: PropertyKey, receiver: any): Collection => {
          let name: string = key.toString()
          if (!this._collection.hasOwnProperty(name)) {
            this._collection[name] = new Collection(this, name)
          }

          return this._collection[name]
        },
        ownKeys: (target) => {
          return Object.keys(this._collection)
        },
        getOwnPropertyDescriptor(target, prop) {
          return {
            enumerable: true,
            configurable: true,
          }
        },
      },
    )
  }

  private getDefaultOptions(): IDBOptions {
    const options: IDBOptions = {
      debug: false,
      dump_delay: settings.io_dump_delay,
      ignore_error: true,
    }

    return options
  }

  async keys(): Promise<IKeys> {
    return await getKeys(this)
  }

  async toJSON(): Promise<IDbDataJSON> {
    let keys = await this.keys()
    let data: IDbDataJSON = {}

    // dict
    data.dict = {}
    if (keys.dict) {
      for (let name of keys.dict) {
        data.dict[name] = await this.dict[name].all()
      }
    }

    // list
    data.list = {}
    if (keys.list) {
      for (let name of keys.list) {
        data.list[name] = await this.list[name].all()
      }
    }

    // set
    data.set = {}
    if (keys.set) {
      for (let name of keys.set) {
        data.set[name] = await this.set[name].all()
      }
    }

    // collection
    data.collection = {}
    if (keys.collection) {
      for (let name of keys.collection) {
        data.collection[name] = {
          meta: await this.collection[name]._getMeta(),
          data: await this.collection[name].all<DataTypeDocument>(),
          index_keys: Object.keys(await this.collection[name].getIndexes()),
        }
      }
    }

    return data
  }

  async loadJSON(data: IDbDataJSON) {
    this._is_loading = true

    data = lodash.cloneDeep(data)

    // dict
    if (data.dict) {
      for (let name of Object.keys(data.dict)) {
        await this.dict[name].update(data.dict[name])
      }
    }

    // list
    if (data.list) {
      for (let name of Object.keys(data.list)) {
        await this.list[name].update(data.list[name])
      }
    }

    // set
    if (data.set) {
      for (let name of Object.keys(data.set)) {
        await this.set[name].update(data.set[name])
      }
    }

    // collection
    if (data.collection) {
      for (let name of Object.keys(data.collection)) {
        await this.collection[name].remove()
        let index_keys = data.collection[name].index_keys
        if (Array.isArray(index_keys)) {
          for (let key of index_keys) {
            await this.collection[name].addIndex(key)
          }
        }

        for (let doc of data.collection[name].data) {
          await this.collection[name]._insert(doc)
        }
        if (data.collection[name].meta) {
          await this.collection[name]._setMeta(data.collection[name].meta)
        }
      }
    }

    this._is_loading = false
  }

  isLoading(): boolean {
    return this._is_loading
  }

  addListener(listener: DataEventListenerFunction) {
    if (this._listeners.indexOf(listener) === -1) {
      this._listeners.push(listener)
    }
  }

  removeListener(listener: DataEventListenerFunction) {
    let index = this._listeners.indexOf(listener)
    if (index !== -1) {
      this._listeners.splice(index, 1)
    }
  }

  addNamedListener(name: string, listener: DataEventListenerFunction) {
    if (!this._named_listeners.hasOwnProperty(name)) {
      this._named_listeners[name] = []
    }

    if (this._named_listeners[name].indexOf(listener) === -1) {
      this._named_listeners[name].push(listener)
    }
  }

  removeNamedListener(name: string, listener: DataEventListenerFunction) {
    if (!this._named_listeners.hasOwnProperty(name)) {
      return
    }

    let index = this._named_listeners[name].indexOf(listener)
    if (index !== -1) {
      this._named_listeners[name].splice(index, 1)
    }
  }

  clearListeners() {
    this._listeners = []

    let names = Object.keys(this._named_listeners)
    for (let name of names) {
      delete this._named_listeners[name]
    }
  }

  callListeners(event: DataEvent) {
    for (let listener of this._listeners) {
      listener(event)
    }

    let names = Object.keys(this._named_listeners)
    let event_name = makeEventName(event)
    for (let name of names) {
      if (name !== event_name) continue
      for (let namedListener of this._named_listeners[name]) {
        namedListener(event)
      }
    }
  }

  hasListeners(): boolean {
    return this._listeners.length > 0 || Object.keys(this._named_listeners).length > 0
  }
}
