/**
 * tools.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

import { DataEvent } from '@/types/event'

export function makeEventName(event: DataEvent): string {
  return `${event.type}.${event.name}:${event.action}`
}
