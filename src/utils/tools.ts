/**
 * tools.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { DataEvent } from '@/types/event'

export function makeEventName(event: DataEvent): string {
  return `${event.type}.${event.name}:${event.action}`
}

export function mergeIds(id_arr1: string[], id_arr2: string[]): string[] {
  // 合并两个数组，去重
  let set = new Set([...id_arr1, ...id_arr2])
  return Array.from(set)
}
