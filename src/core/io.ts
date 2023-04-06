/**
 * io
 * @author: oldj
 * @homepage: https://oldj.net
 */

import * as fs from 'fs'
import * as path from 'path'
import { DataTypeDict, DataTypeList, DataTypeSet } from '@/types/basic'
import { ensureDir } from '@/utils/fs2'
import wait from '@/utils/wait'
import { FileHandle } from 'fs/promises'

type DataType = 'dict' | 'list' | 'set' | 'collection'

interface IIOOptions {
  debug?: boolean
  data_path: string
  data_type: DataType
  dump_delay: number
  formative?: boolean
}

export default class IO {
  private options: IIOOptions
  private readonly data_path: string
  private readonly data_type: DataType
  private readonly _dump_delay: number // dump 节流间隔，单位为 ms
  private _last_dump_ts: number = 0
  private _t_dump: any
  private _is_dir_ensured: boolean = false
  private rw_status: 'r' | 'w' | null = null // 读写状态

  constructor(options: IIOOptions) {
    this.options = { ...options }
    this.data_path = options.data_path
    this.data_type = options.data_type
    this._dump_delay = options.dump_delay
  }

  private async waitWhileRW(max_wait_ms = 5000) {
    let t0 = Date.now()
    while (this.rw_status) {
      await wait(Math.floor(Math.random() * 50) + 10)

      let t1 = Date.now()
      if (t1 - t0 > max_wait_ms) break
    }
  }

  private async load_file(fn: string) {
    await this.waitWhileRW()
    this.rw_status = 'r'

    let d: any
    let content: string = 'N/A'
    let file_handle: FileHandle | null = null

    try {
      if (this.options.debug) {
        console.log(`[potdb] io.load_file start: -> ${fn}`)
      }

      file_handle = await fs.promises.open(fn, 'r')
      content = await file_handle.readFile('utf-8')
      d = JSON.parse(content)
    } catch (e) {
      console.error(e)
      console.log(`fn: ${fn}`)
      console.log('---')
      console.log(content)
      console.log('---')
    } finally {
      await file_handle?.close()
      // await wait(50)
      this.rw_status = null

      if (this.options.debug) {
        console.log(`[potdb] io.load_file end: -> ${fn}`)
      }
    }

    return d
  }

  private async load_dict(): Promise<DataTypeDict> {
    let data: DataTypeDict = {}

    if (!fs.existsSync(this.data_path)) {
      return data
    }

    let d: any = await this.load_file(this.data_path)
    if (typeof d === 'object') {
      data = { ...d }
    }
    // console.log(data)

    return data
  }

  private async load_list(): Promise<DataTypeList> {
    let data: DataTypeList = []

    if (!fs.existsSync(this.data_path)) {
      return data
    }

    let d: any = await this.load_file(this.data_path)
    if (Array.isArray(d)) {
      data = [...d]
    }

    return data
  }

  private async load_set(): Promise<DataTypeSet> {
    let data: DataTypeSet = new Set()

    if (!fs.existsSync(this.data_path)) {
      return data
    }

    let d: any = await this.load_file(this.data_path)
    if (Array.isArray(d)) {
      d.map((v) => data.add(v))
    }

    return data
  }

  async load<T>(): Promise<T> {
    let data: any

    if (!this._is_dir_ensured) {
      let dir_path = path.dirname(this.data_path)
      await ensureDir(dir_path)
      this._is_dir_ensured = true
    }

    switch (this.data_type) {
      case 'dict':
        data = await this.load_dict()
        break
      case 'list':
        data = await this.load_list()
        break
      case 'set':
        data = await this.load_set()
        break
    }

    return data
  }

  private async dump_file(data: any, fn: string) {
    await this.waitWhileRW()
    this.rw_status = 'w'

    if (this.data_type === 'set') {
      data = Array.from(data)
    }

    let file_handle: FileHandle | null = null

    try {
      let out = this.options.formative ? JSON.stringify(data, null, 2) : JSON.stringify(data)

      if (this.options.debug) {
        console.log(`[potdb] io.dump_file start: -> ${fn}`)
      }

      await ensureDir(path.dirname(fn))
      file_handle = await fs.promises.open(fn, 'w')
      await file_handle.writeFile(out, 'utf-8')
    } catch (e) {
      console.error(e)
    } finally {
      await file_handle?.close()
      // await wait(50)
      this.rw_status = null

      if (this.options.debug) {
        console.log(`[potdb] io.dump_file end: -> ${fn}`)
      }
    }
  }

  async dump(data: any) {
    clearTimeout(this._t_dump)

    let ts = Date.now()

    if (ts - this._last_dump_ts < this._dump_delay) {
      this._t_dump = setTimeout(() => this.dump(data), this._dump_delay)
      return
    }

    this._last_dump_ts = ts

    await this.dump_file(data, this.data_path)
  }

  async remove() {
    let fn = this.data_path
    if (!fn || !fs.existsSync(fn)) return

    await fs.promises.unlink(fn)
  }
}
