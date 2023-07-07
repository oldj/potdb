/**
 * event
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'
import { DataObjectType } from '@/types/basic'
import { DataActionType } from '@/types/event'
import Collection from '@core/datatype/collection'

type GetValueFunc = (obj: DataObjectType, ...args: any[]) => any
type GetValueType = GetValueFunc | 'all' | 'filter' | 'result'
type GetOriginalValueType = 'get' | 'all' | 'filter'

export const listen = (
  action: DataActionType,
  getValue?: GetValueType,
  getOriginalValue?: GetOriginalValueType,
) => {
  return (target: any, property_name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    descriptor.value = async function (this: DataObjectType, ...args: any[]) {
      const is_loading = this.isLoading()
      const new_args = is_loading
        ? args
        : args.map((i) => {
            return i && typeof i === 'object' ? lodash.cloneDeep(i) : i
          })
      const has_listeners = this.db.hasListeners()
      let value: any = null

      if (has_listeners && !getValue) {
        value = lodash.cloneDeep(new_args[0])
      }

      let original_value: any = null
      let has_original_value = false
      if (getOriginalValue) {
        if (getOriginalValue === 'all') {
          original_value = await this.all()
          has_original_value = true
        } else if (getOriginalValue === 'filter') {
          original_value = await (this as Collection).filter(args[0])
          has_original_value = true
        } else if (getOriginalValue === 'get') {
          if (this.type === 'dict') {
            original_value = await this.get(args[0])
            has_original_value = true
          }
        }
      }
      let is_not_changed = false
      if (action === 'update' && has_original_value) {
        // 检查传入的值是否与原值相同
        let type = this.type
        let method_name = method.name

        if (type === 'collection' && method_name === 'update') {
          if (original_value && Array.isArray(original_value) && original_value.length === 1) {
            let item = original_value[0]
            let update = args[1]
            let keys = Object.keys(update)
            if (lodash.isEqual(lodash.pick(item, keys), update)) {
              is_not_changed = true
            }
          }
        } else if (type === 'dict') {
          if (method_name === 'set') {
            let value = args[1]
            if (original_value === value) {
              is_not_changed = true
            }
          } else if (method_name === 'update') {
            let obj = args[0]
            let keys = Object.keys(obj)
            if (original_value && lodash.isEqual(lodash.pick(original_value, keys), obj)) {
              is_not_changed = true
            }
          }
        } else if (type === 'list') {
          if (method_name === 'set' || method_name === 'update') {
            let new_list = args[0]
            if (lodash.isEqual(original_value, new_list)) {
              is_not_changed = true
            }
          }
        } else if (type === 'set') {
          if (method_name === 'set' || method_name === 'update') {
            let new_set_arr = args[0]
            if (
              original_value &&
              lodash.isEqual(original_value.slice().sort(), new_set_arr.slice().sort())
            ) {
              is_not_changed = true
            }
          }
        }
      }

      // 执行原方法
      let result = await method.apply(this, new_args)

      if (!is_loading && result && typeof result === 'object') {
        result = lodash.cloneDeep(result)
      }

      // 如果有监听器
      if (has_listeners && !is_not_changed) {
        // 更新 value
        if (getValue) {
          if (typeof getValue === 'function') {
            value = await getValue(this, ...new_args)
          } else if (getValue === 'all') {
            value = await this.all()
          } else if (getValue === 'filter') {
            value = await (this as Collection).filter(args[0])
          } else if (getValue === 'result') {
            value = result
          }
          value = lodash.cloneDeep(value)
        }
        // 回调事件
        this.db.callListeners({
          action,
          type: this.type,
          name: this.name,
          value,
        })
      }

      return result
    }
    return descriptor
  }
}
