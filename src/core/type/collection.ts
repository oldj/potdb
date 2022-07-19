/**
 * collection
 * @author: oldj
 * @homepage: https://oldj.net
 */

import * as fs from 'fs'
import lodash from 'lodash'
import * as path from 'path'
import { DataTypeDocument } from '../../typings'
import { asInt } from '../../utils/asType'
import { clone } from '../../utils/clone'
import PotDb from '../db'
import Dict from './dict'
import List from './list'

type FilterByIndex = [string, any]
type FilterPredicate = (item: any) => boolean

interface IIndex {
  [val: string]: string[]
}

interface Options {}

export default class Collection {
  name: string
  private _db: PotDb
  private readonly _path: string | null
  private readonly _path_data: string | null
  private options: Options = {}
  private _meta: Dict
  private _ids: List
  private _docs: { [key: string]: Dict } = {}
  // 静态索引，对应的值不会变化，比如 id 值
  private _simple_indexes: Dict

  constructor(db: PotDb, name: string) {
    this._db = db
    this.name = name
    this._path = db.dir ? path.join(db.dir, 'collection', name) : null
    this._path_data = this._path ? path.join(this._path, 'data') : null

    this._meta = new Dict(db, 'meta', this._path, db.options)
    this._ids = new List(db, 'ids', this._path, db.options)
    this._simple_indexes = new Dict(db, 'indexes', this._path, db.options)
  }

  updateConfig(options: Partial<Options>) {
    this.options = {
      ...this.options,
      ...options,
    }
  }

  async addIndex(key: string) {
    await this.getOrAddIndex(key)
    // await this.rebuildIndexes()
  }

  async removeIndex(key: string, value?: string) {
    if (typeof value === 'undefined') {
      await this._simple_indexes.delete(key)
    } else {
      let index = await this._simple_indexes.get<IIndex>(key)
      if (index) {
        delete index[value]
        await this._simple_indexes.update({ [key]: index })
      }
    }
  }

  private async getOrAddIndex(key: string): Promise<IIndex> {
    let index: IIndex | undefined = await this._simple_indexes.get(key)
    if (!index || typeof index !== 'object') {
      index = {}
      await this._simple_indexes.set(key, index)
    }

    return index
  }

  private async makeId(): Promise<string> {
    let index = asInt(await this._meta.get('index'), 0)
    if (index < 0) index = 0
    index++
    await this._meta.set('index', index)

    // let ts = ((new Date()).getTime() % 1000).toString().padStart(3, '0')
    // return `${index}${ts}`

    return index.toString()
  }

  @clone
  async getIndexes(): Promise<Readonly<{ [key: string]: IIndex }>> {
    return await this._simple_indexes.all()
  }

  private async ensureDocIndex(doc: Dict) {
    let d: any = await doc.all()
    let _id = d._id
    let keys = await this._simple_indexes.keys()

    for (let index_key of keys) {
      let val: string = (d[index_key] || '').toString()
      let index = await this.getOrAddIndex(index_key)
      let _ids = index[val]
      if (!_ids) {
        _ids = []
        index[val] = _ids
      }

      if (!_ids.includes(_id)) {
        _ids.push(_id)
      }
      await this._simple_indexes.update({ [index_key]: index })
    }
  }

  private async clearIndexes() {
    let keys = await this._simple_indexes.keys()
    for (let index_key of keys) {
      await this._simple_indexes.update({ [index_key]: {} })
    }
  }

  async rebuildIndexes() {
    // 根据最新的数据，重建所有索引
    // await this.clearIndexes()
    let _ids = await this._ids.all()
    let keys = await this._simple_indexes.keys()
    let indexes: { [key: string]: IIndex } = {}
    for (let key of keys) {
      indexes[key] = {}
    }

    await Promise.all(
      _ids.map(async (_id) => {
        let d: DataTypeDocument = await (await this.getDoc(_id)).all()
        for (let index_key of keys) {
          let val: string = (d[index_key] || '').toString()
          let index = indexes[index_key]
          let _ids = index[val]
          if (!_ids) {
            _ids = []
            index[val] = _ids
          }

          if (!_ids.includes(_id)) {
            _ids.push(_id)
          }
        }
      }),
    )

    await this._simple_indexes.update(indexes)
  }

  private async removeDocIndex(_id: string) {
    let keys = await this._simple_indexes.keys()
    for (let index_key of keys) {
      let index = await this.getOrAddIndex(index_key)
      for (let val_key in index) {
        let arr = index[val_key]
        while (true) {
          let idx = arr.indexOf(_id)
          if (idx > -1) {
            arr.splice(idx, 1)
          } else {
            break
          }
        }
      }
      await this._simple_indexes.update({ [index_key]: index })
    }
  }

  private async getDoc(_id: string): Promise<Dict> {
    if (!this._docs[_id]) {
      this._docs[_id] = new Dict(this._db, _id, this._path_data, this._db.options)
    }

    return this._docs[_id]
  }

  async count(): Promise<number> {
    return (await this._ids.all()).length
  }

  async insert<T>(doc: T): Promise<T & { _id: string }> {
    let _id = await this.makeId()
    let doc2 = { ...doc, _id }
    await this._insert(doc2)
    return doc2
  }

  /**
   * 类似 insert 方法，但不同的是如果传入的 doc 包含 _id 参数，侧会尝试更新对应的文档
   * 如果不存在 _id 参数，或者 _id 对应的文档不存在，则新建
   * 这个方法一般用在 db.loadJSON() 等场景
   */
  async _insert(doc: DataTypeDocument) {
    let _id = doc._id
    await this._ids.push(_id)
    let d = await this.getDoc(_id)
    await d.update(doc)
    await this.ensureDocIndex(d)
  }

  async all<T>(keys: string | string[] = '*'): Promise<T[]> {
    let _ids = await this._ids.all()
    let data = await Promise.all(
      _ids.map(async (_id) => {
        let d = await this.getDoc(_id)
        let doc: T = await d.toJSON<T>()

        if (Array.isArray(keys)) {
          doc = lodash.pick(doc, keys) as T
        }

        return doc
      }),
    )

    return data as T[]
  }

  async index<T>(index: number, keys: string | string[] = '*'): Promise<T | undefined> {
    let _id = await this._ids.index(index)
    if (!_id) return

    return await this.find<T>((i) => i._id === _id, keys)
  }

  async find<T>(
    predicate: FilterPredicate | FilterByIndex,
    keys: string | string[] = '*',
  ): Promise<T | undefined> {
    if (Array.isArray(predicate)) {
      let [key, value] = predicate
      let index = (await this._simple_indexes.get<IIndex>(key)) || {}
      let _ids = index[value] || []
      let _id = _ids[0]
      if (!_id) return

      let d = await this.getDoc(_id)
      if (!d) return
      let doc: T = await d.toJSON<T>()

      if (Array.isArray(keys)) {
        doc = lodash.pick(doc, keys) as T
      }

      return doc
    }

    let _ids = await this._ids.all()

    for (let _id of _ids) {
      let d = await this.getDoc(_id)
      let doc: T = await d.toJSON<T>()

      if (predicate(doc)) {
        if (Array.isArray(keys)) {
          doc = lodash.pick(doc, keys) as T
        }

        return doc
      }
    }
  }

  async filter<T>(
    predicate: FilterPredicate | FilterByIndex,
    keys: string | string[] = '*',
  ): Promise<T[]> {
    let _ids = await this._ids.all()
    let list: T[] = []

    if (Array.isArray(predicate)) {
      let [key, value] = predicate
      let index = (await this._simple_indexes.get<IIndex>(key)) || {}
      let _ids = index[value] || []

      for (let _id of _ids) {
        let doc = await this.getDoc(_id)
        list.push(await doc.toJSON())
      }

      return list
    }

    for (let _id of _ids) {
      let d = await this.getDoc(_id)
      let doc: T = await d.toJSON<T>()

      if (predicate(doc)) {
        if (Array.isArray(keys)) {
          doc = lodash.pick(doc, keys) as T
        }

        list.push(doc)
      }
    }

    return list
  }

  async update<T>(predicate: FilterPredicate | FilterByIndex, data: Partial<T>): Promise<T[]> {
    let items = await this.filter<DataTypeDocument>(predicate)
    let out: T[] = []

    for (let item of items) {
      let { _id } = item
      let d = await this.getDoc(_id)
      let doc: T = await d.toJSON<T>()

      doc = {
        ...doc,
        ...data,
        _id,
      }

      let i = await d.update<T>(doc)
      out.push(i)
    }

    return out
  }

  async delete(predicate: FilterPredicate | FilterByIndex) {
    let items = await this.filter<DataTypeDocument>(predicate)
    for (let { _id } of items) {
      let index = await this._ids.indexOf(_id)
      if (index === -1) continue

      await this._ids.splice(index, 1)
      let d = await this.getDoc(_id)
      await d.remove()
      delete this._docs[_id]
      await this.removeDocIndex(_id)
    }

    if (Array.isArray(predicate)) {
      await this.removeIndex(...predicate)
    }
  }

  async remove() {
    // remove current collection
    await this._meta.remove()
    await this._ids.remove()
    await this._simple_indexes.remove()
    this._docs = {}
    if (this._path && fs.existsSync(this._path)) {
      await fs.promises.rm(this._path, { recursive: true })
    }
  }

  @clone
  async _getMeta() {
    return await this._meta.all<DataTypeDocument>()
  }

  @clone
  async _setMeta(data: any) {
    let keys = Object.keys(data)
    for (let k of keys) {
      await this._meta.set(k, data[k])
    }
  }

  isLoading(): boolean {
    return this._db.isLoading()
  }
}
