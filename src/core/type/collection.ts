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

interface IIndex<T> {
  [key: string]: {
    [_id: string]: T
  }
}

interface Options {

}

export default class Collection {
  name: string
  private _db: PotDb
  private readonly _path: string
  private readonly _path_data: string
  private options: Options = {}
  private _meta: Dict
  private _ids: List
  private _docs: { [key: string]: Dict } = {}
  // 静态索引，对应的值不会变化，比如 id 值
  private _simple_indexes: { [key: string]: IIndex<any> } = {}

  constructor (db: PotDb, name: string) {
    this._db = db
    this.name = name
    this._path = path.join(db.dir, 'collection', name)
    this._path_data = path.join(this._path, 'data')

    this._meta = new Dict('meta', this._path, db.options)
    this._ids = new List('ids', this._path, db.options)
  }

  updateConfig (options: Partial<Options>) {
    this.options = {
      ...this.options,
      ...options,
    }
  }

  addIndex (key: string) {
    if (!(key in this._simple_indexes)) {
      this._simple_indexes[key] = {}
    }
  }

  removeIndex (key: string) {
    delete this._simple_indexes[key]
  }

  private async makeId (): Promise<string> {
    let index = asInt(await this._meta.get('index'), 0)
    if (index < 0) index = 0
    index++
    await this._meta.set('index', index)

    // let ts = ((new Date()).getTime() % 1000).toString().padStart(3, '0')
    // return `${index}${ts}`

    return index.toString()
  }

  async getIndexes () {
    return this._simple_indexes
  }

  private async ensureIndex (doc: Dict) {
    for (let index_key in this._simple_indexes) {
      let d: any = await doc.all()
      let doc_key: string = (d[index_key] || '').toString()
      let index = this._simple_indexes[index_key]
      if (!index[doc_key]) {
        index[doc_key] = {}
      }
      index[doc_key][d['_id'] || ''] = doc
    }
  }

  private removeDocIndex (_id: string) {
    for (let index_key in this._simple_indexes) {
      let index = this._simple_indexes[index_key]
      for (let doc_key in index) {
        delete index[doc_key][_id]
      }
    }
  }

  private async getDoc (_id: string): Promise<Dict> {
    if (!this._docs[_id]) {
      this._docs[_id] = new Dict(_id, this._path_data, this._db.options)
    }

    let doc = this._docs[_id]
    await this.ensureIndex(doc)

    return doc
  }

  async count (): Promise<number> {
    return (await this._ids.all()).length
  }

  async insert<T> (doc: T): Promise<T & { _id: string }> {
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
  async _insert (doc: DataTypeDocument) {
    let _id = doc._id
    await this._ids.push(_id)
    let d = await this.getDoc(_id)
    await d.update(doc)
    await this.ensureIndex(d)
  }

  async all<T> (keys: string | string[] = '*'): Promise<T[]> {
    let data = await Promise.all((await this._ids.all()).map(async _id => {
      let d = await this.getDoc(_id)
      let doc: T = await d.toJSON<T>()

      if (Array.isArray(keys)) {
        doc = lodash.pick(doc, keys) as T
      }

      return doc
    }))

    return data as T[]
  }

  async index<T> (index: number, keys: string | string[] = '*'): Promise<T | undefined> {
    let _id = await this._ids.index(index)
    if (!_id) return

    return await this.find<T>(i => i._id === _id, keys)
  }

  async find<T> (predicate: FilterPredicate | FilterByIndex, keys: string | string[] = '*'): Promise<T | undefined> {
    if (Array.isArray(predicate)) {
      let [key, value] = predicate
      let index = this._simple_indexes[key] || {}
      let dict = index[value] || {}
      let list = Object.values(dict)

      let d = list[0] as Dict
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

  async filter<T> (predicate: FilterPredicate | FilterByIndex, keys: string | string[] = '*'): Promise<T[]> {
    let _ids = await this._ids.all()
    let list: T[] = []

    if (Array.isArray(predicate)) {
      let [key, value] = predicate
      let index = this._simple_indexes[key] || {}
      let dict = index[value] || {}
      let items = Object.values(dict)

      for (let item of items) {
        list.push(await item.toJSON())
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

  async update<T> (predicate: FilterPredicate, data: Partial<T>): Promise<T[]> {
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

  async delete (predicate: FilterPredicate) {
    while (true) {
      let item = await this.find<DataTypeDocument>(predicate)
      if (!item) break

      let index = await this._ids.indexOf(item._id)
      if (index === -1) continue

      await this._ids.splice(index, 1)
      let d = await this.getDoc(item._id)
      await d.remove()
      delete this._docs[item._id]
    }
  }

  async remove () {
    // remove current collection
    await this._meta.remove()
    await this._ids.remove()
    this._docs = {}
    this._simple_indexes = {}
    if (fs.existsSync(this._path)) {
      await fs.promises.rm(this._path, { recursive: true })
    }
  }

  @clone
  async _getMeta () {
    return await this._meta.all<DataTypeDocument>()
  }

  @clone
  async _setMeta (data: any) {
    let keys = Object.keys(data)
    for (let k of keys) {
      await this._meta.set(k, data[k])
    }
  }
}
