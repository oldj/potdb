/**
 * list
 * @author: oldj
 * @homepage: https://oldj.net
 */

import * as path from 'path'
import { DataTypeList, IBasicOptions } from '@/types/basic'
import { clone } from '@/utils/clone'
import IO from '@core/io'
import PotDb from '@core/db'
import { listen } from '@/utils/event'

interface Options extends IBasicOptions {}

type FilterPredicate = (item: any) => boolean
type MapFunction = (item: any) => any

export default class List {
  private _db: PotDb
  private _data: DataTypeList | null = null
  private _path: string | null
  private _io: IO | null
  name: string

  constructor(db: PotDb, name: string, root_dir: string | null, options: Options) {
    this._db = db
    this._path = root_dir ? path.join(root_dir, name + '.json') : null
    this.name = name
    this._io = this._path
      ? new IO({
          data_type: 'list',
          data_path: this._path,
          debug: options.debug,
          dump_delay: options.dump_delay,
        })
      : null
  }

  get type(): 'list' {
    return 'list'
  }

  get db(): PotDb {
    return this._db
  }

  private async ensure(): Promise<DataTypeList> {
    if (this._data === null) {
      if (this._io) {
        this._data = await this._io.load<DataTypeList>()
      } else {
        this._data = []
      }
    }

    return this._data
  }

  private dump() {
    if (this._data === null || !this._io) return
    this._io.dump([...this._data]).catch((e) => console.error(e))
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async rpush(value: any) {
    this._data = await this.ensure()
    this._data.push(value)
    this.dump()
  }

  @listen('update', (obj) => obj.all())
  async rpop(): Promise<any> {
    this._data = await this.ensure()
    let v = this._data.pop()
    this.dump()

    return v
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async rextend(...values: any[]) {
    this._data = await this.ensure()
    this._data = [...this._data, ...values]
    this.dump()
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async lpush(value: any) {
    this._data = await this.ensure()
    this._data.unshift(value)
    this.dump()
  }

  @listen('update', (obj) => obj.all())
  async lpop(): Promise<any> {
    this._data = await this.ensure()
    let v = this._data.shift()
    this.dump()

    return v
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async lextend(...values: any[]) {
    this._data = await this.ensure()
    this._data = [...values, ...this._data]
    this.dump()
  }

  @listen('update', (obj) => obj.all())
  async push(value: any) {
    await this.rpush(value)
  }

  @listen('update', (obj) => obj.all())
  async pop(): Promise<any> {
    return await this.rpop()
  }

  @listen('update', (obj) => obj.all())
  async extend(...values: any[]) {
    await this.rextend(...values)
  }

  @clone
  async all(): Promise<any[]> {
    return await this.ensure()
  }

  @clone
  async find<T>(predicate: FilterPredicate): Promise<T | undefined> {
    this._data = await this.ensure()
    return this._data.find(predicate)
  }

  @clone
  async filter<T>(predicate: FilterPredicate): Promise<T[]> {
    this._data = await this.ensure()
    return this._data.filter(predicate)
  }

  @clone
  async map<T>(predicate: MapFunction): Promise<T[]> {
    this._data = await this.ensure()
    return this._data.map(predicate)
  }

  @clone
  async index<T>(index: number): Promise<T | undefined> {
    this._data = await this.ensure()

    if (index < 0) {
      let idx = Math.abs(index)
      let length = this._data.length
      if (length < idx) {
        return undefined
      }

      index = length - idx
    }

    return this._data[index]
  }

  async indexOf(predicate: string | number | boolean | null | FilterPredicate): Promise<number> {
    this._data = await this.ensure()

    if (typeof predicate === 'function') {
      for (let i = 0; i < this._data.length; i++) {
        if (predicate(this._data[i])) {
          return i
        }
      }
      return -1
    } else {
      return this._data.indexOf(predicate)
    }
  }

  @clone
  async slice<T>(start: number, end?: number): Promise<T[]> {
    this._data = await this.ensure()
    let args = [start]
    if (typeof end === 'number') {
      args.push(end)
    }
    return this._data.slice(...args)
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async splice<T>(start: number, delete_count: number, ...insert_items: T[]): Promise<T[]> {
    this._data = await this.ensure()
    let v = this._data.splice(start, delete_count, ...insert_items)
    this.dump()
    return v
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async delete<T>(predicate: FilterPredicate): Promise<T[]> {
    this._data = await this.filter((i) => !predicate(i))
    this.dump()

    return this._data
  }

  @listen('update', (obj) => obj.all())
  // @clone
  async set(data: any[]) {
    this._data = data
    this.dump()
  }

  @listen('update', (obj) => obj.all())
  async clear() {
    this._data = []
    this.dump()
  }

  @listen('delete', (obj) => obj.all())
  async remove() {
    this._data = []
    if (this._io) {
      await this._io.remove()
    }
  }

  @listen('update', (obj) => obj.all())
  async update(data: any[]) {
    this._data = data
    this.dump()
  }

  isLoading(): boolean {
    return this._db.isLoading()
  }
}
