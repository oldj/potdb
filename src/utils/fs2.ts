/**
 * ensureDir
 * @author: oldj
 * @homepage: https://oldj.net
 */

import fs from 'fs'

export const isDir = (dir_path: string) => {
  return fs.existsSync(dir_path) && fs.lstatSync(dir_path).isDirectory()
}

export const isFile = (dir_path: string) => {
  return fs.existsSync(dir_path) && fs.lstatSync(dir_path).isFile()
}

export const ensureDir = async (dir_path: string) => {
  if (isDir(dir_path)) return
  await fs.promises.mkdir(dir_path, { recursive: true })
}

export const removeDir = async (dir_path: string) => {
  if (!isDir(dir_path)) return
  await fs.promises.rm(dir_path, { recursive: true })
}
