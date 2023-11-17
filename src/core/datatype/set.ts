/**
 * set
 * @author: oldj
 * @homepage: https://oldj.net
 */

import * as path from 'path'
import { DataTypeSet, DataTypeSetItem, IBasicOptions } from '@/types/basic'
import PotDb from '@core/db'
import IO from '@core/io'
import { listen } from '@/utils/event'

interface Options extends IBasicOptions {}

export default class PotSet {
  private _db: PotDb
  private _data: DataTypeSet | null = null
  private _path: string | null
  private _io: IO | null
  name: string

  constructor(db: PotDb, name: string, root_dir: string | null, options: Options) {
    this._db = db
    this._path = root_dir ? path.join(root_dir, name + '.json') : null
    this.name = name
    this._io = this._path
      ? new IO({
          data_type: 'set',
          data_path: this._path,
          debug: options.debug,
          dump_delay: options.dump_delay,
        })
      : null
  }

  get type(): 'set' {
    return 'set'
  }

  get db(): PotDb {
    return this._db
  }

  private async ensure(): Promise<DataTypeSet> {
    if (this._data === null) {
      if (this._io) {
        this._data = await this._io.load<DataTypeSet>()
      } else {
        this._data = new Set() as DataTypeSet
      }
    }

    return this._data
  }

  private dump() {
    if (this._data === null || !this._io) return
    this._io.dump(Array.from(this._data)).catch((e) => console.error(e))
  }

  @listen('update', 'all')
  async add(value: DataTypeSetItem) {
    this._data = await this.ensure()
    this._data.add(value)
    this.dump()
  }

  @listen('update', 'all')
  async delete(value: DataTypeSetItem) {
    this._data = await this.ensure()
    this._data.delete(value)
    this.dump()
  }

  async has(value: DataTypeSetItem): Promise<boolean> {
    this._data = await this.ensure()
    return this._data.has(value)
  }

  async all(): Promise<DataTypeSetItem[]> {
    this._data = await this.ensure()
    return Array.from(this._data)
  }

  async __clear() {
    this._data = new Set([])
    this.dump()
  }

  @listen('update', 'all')
  async clear() {
    await this.__clear()
  }

  @listen('update', 'all', 'all')
  // @clone
  async set(data: DataTypeSetItem[]) {
    this._data = new Set(data)
    this.dump()
  }

  @listen('delete')
  async remove() {
    this._data = new Set()
    if (this._io) {
      await this._io.remove()
    }
  }

  @listen('update', 'all', 'all')
  async update(data: DataTypeSetItem[]) {
    this._data = new Set(data)
    this.dump()
  }

  isLoading(): boolean {
    return this._db.isLoading()
  }
}
