/**
 * hash
 * @author: oldj
 * @homepage: https://oldj.net
 */

import * as path from 'path'
import { DataTypeDict, IBasicOptions } from '../../typings'
import { clone } from '../../utils/clone'
import IO from '../io'

interface Options extends IBasicOptions {}

export default class Dict {
  private _data: DataTypeDict | null = null
  private _io: IO | null
  private _path: string | null
  name: string

  constructor(name: string, dir: string | null, options: Options) {
    this._path = dir ? path.join(dir, name + '.json') : null
    this.name = name
    this._io = this._path
      ? new IO({
          data_type: 'dict',
          data_path: this._path,
          debug: options.debug,
          dump_delay: options.dump_delay,
        })
      : null
  }

  private async ensure(): Promise<DataTypeDict> {
    if (this._data === null) {
      if (this._io) {
        this._data = await this._io.load<DataTypeDict>()
      } else {
        this._data = {}
      }
    }

    return this._data
  }

  private dump() {
    if (this._data === null || !this._io) return
    this._io.dump({ ...this._data }).catch((e) => console.error(e))
  }

  @clone
  async get<T>(key: string, default_value?: T): Promise<T | undefined> {
    this._data = await this.ensure()

    if (this._data.hasOwnProperty(key)) {
      return this._data[key]
    }

    return default_value
  }

  @clone
  async set(key: string, value: any) {
    this._data = await this.ensure()
    this._data[key] = value
    this.dump()
  }

  @clone
  async update<T>(obj: { [key: string]: any }): Promise<T> {
    this._data = await this.ensure()
    this._data = {
      ...this._data,
      ...obj,
    }
    this.dump()

    return this._data as T
  }

  async keys(): Promise<string[]> {
    this._data = await this.ensure()

    return Object.keys(this._data)
  }

  @clone
  async all<T>(): Promise<T> {
    return (await this.ensure()) as T
  }

  @clone
  async toJSON<T>(): Promise<T> {
    return (await this.all()) as T
  }

  async delete(key: string) {
    this._data = await this.ensure()
    if (!this._data.hasOwnProperty(key)) {
      return
    }
    delete this._data[key]
    this.dump()
  }

  async clear() {
    this._data = {}
    this.dump()
  }

  async remove() {
    this._data = {}
    if (this._io) {
      await this._io.remove()
    }
  }
}
