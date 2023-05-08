/**
 * getJSONFiles.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import fs from 'fs'

export async function getJSONFiles(dir_path: string): Promise<string[]> {
  // 获取指定目录下的所有 JSON 文件名（不包含后缀）
  let files = await fs.promises.readdir(dir_path)
  let list = []
  for (let f of files) {
    if (!f.endsWith('.json')) continue
    list.push(f.slice(0, -5))
  }
  return list
}

export function getJSONFilesSync(dir_path: string): string[] {
  // 获取指定目录下的所有 JSON 文件名（不包含后缀）
  let files = fs.readdirSync(dir_path)
  let list = []
  for (let f of files) {
    if (!f.endsWith('.json')) continue
    list.push(f.slice(0, -5))
  }
  return list
}
