/**
 * event
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'
import { DataObjectType } from '@/types/basic'
import { DataActionType } from '@/types/event'

type SetValueFunc = (...args: any[]) => any

export const listen = (action: DataActionType, setValue?: SetValueFunc) => {
  return (target: any, property_name: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    descriptor.value = async function (this: DataObjectType, ...args: any[]) {
      let is_loading = this.isLoading()
      let new_args = is_loading
        ? args
        : args.map((i) => {
            return i && typeof i === 'object' ? lodash.cloneDeep(i) : i
          })
      let value = new_args[0]

      // console.log(property_name)
      // 更新 value
      if (setValue) {
        value = setValue.apply(this, new_args)
      }

      // console.log(action, this.type, this.name, ...values)
      // 广播事件
      this.db.callListeners({
        action,
        type: this.type,
        name: this.name,
        value,
      })

      let result = await method.apply(this, new_args)
      if (!is_loading && result && typeof result === 'object') {
        result = lodash.cloneDeep(result)
      }

      return result
    }
    return descriptor
  }
}
