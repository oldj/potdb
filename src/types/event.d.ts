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
  key: string
}

export interface AddEventType extends BaseEventType {
  action: 'add'
  value: any
}

export interface DeleteEventType extends BaseEventType {
  action: 'delete'
}

export interface IUpdateEvent extends BaseEventType {
  action: 'update'
  old_value: any
  new_value: any
}

export type DataEventListenerFunction = (
  event: AddEventType | DeleteEventType | IUpdateEvent,
) => void
