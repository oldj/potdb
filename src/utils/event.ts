/**
 * event
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'
import { DataObjectType } from '@/types/basic'
import { DataActionType } from '@/types/event'

type GetValueFunc = (obj: DataObjectType, ...args: any[]) => any
type GetValueType = GetValueFunc | 'all' | 'result'

export const listen = (action: DataActionType, getValue?: GetValueType) => {
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

      // 执行原方法
      let result = await method.apply(this, new_args)

      if (!is_loading && result && typeof result === 'object') {
        result = lodash.cloneDeep(result)
      }

      // 如果有监听器
      if (this.db.hasListeners()) {
        // 更新 value
        if (getValue) {
          if (typeof getValue === 'function') {
            value = await getValue(this, ...new_args)
          } else if (getValue === 'all') {
            value = await this.all()
          } else if (getValue === 'result') {
            value = result
          }
          value = lodash.cloneDeep(value)
        }
        // console.log(action, this.type, this.name, ...values)
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
