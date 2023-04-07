/**
 * event.d.ts
 * @author: oldj
 * @homepage: https://oldj.net
 */

export type DataActionType = 'add' | 'delete' | 'update'
export type DataType = 'dict' | 'list' | 'set' | 'collection'

interface BaseEventType {
  action: DataActionType
  type: DataType
  name: string
  value: any
}

export interface AddEventType extends BaseEventType {
  action: 'add'
}

export interface IUpdateEvent extends BaseEventType {
  action: 'update'
}

export interface DeleteEventType extends BaseEventType {
  action: 'delete'
}

export type DataEvent = AddEventType | DeleteEventType | IUpdateEvent

export type DataEventListenerFunction = (event: DataEvent) => void
