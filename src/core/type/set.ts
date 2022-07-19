/**
 * set
 * @author: oldj
 * @homepage: https://oldj.net
 */

import * as path from 'path'
import { DataTypeSet, DataTypeSetItem, IBasicOptions } from '../../typings'
import { clone } from '../../utils/clone'
import PotDb from '../db'
import IO from '../io'

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

  async add(value: DataTypeSetItem) {
    this._data = await this.ensure()
    this._data.add(value)
    this.dump()
  }

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

  async clear() {
    this._data = new Set()
    this.dump()
  }

  @clone
  async set(data: any[]) {
    let s = new Set<DataTypeSetItem>()
    data.map((i) => s.add(i))
    this._data = s
    this.dump()
  }

  async remove() {
    this._data = new Set()
    if (this._io) {
      await this._io.remove()
    }
  }

  async update(data: DataTypeSetItem[]) {
    this._data = new Set(data)
    this.dump()
  }

  isLoading(): boolean {
    return this._db.isLoading()
  }
}
