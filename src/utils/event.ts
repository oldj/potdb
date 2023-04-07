/**
 * event
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'
import { DataObjectType } from '@/types/basic'
import { DataActionType } from '@/types/event'

export const listen = (action: DataActionType) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value
    descriptor.value = async function (this: DataObjectType, ...args: any[]) {
      let is_loading = this.isLoading()
      let values = is_loading
        ? args
        : args.map((i) => {
            return i && typeof i === 'object' ? lodash.cloneDeep(i) : i
          })

      console.log(action, this.type, this.name, ...values)
      // 广播事件
      this.db.callListeners({
        action,
        type: this.type,
        name: this.name,
        value: values[0],
      })

      let result = await method.apply(this, values)
      if (!is_loading && result && typeof result === 'object') {
        result = lodash.cloneDeep(result)
      }

      return result
    }
    return descriptor
  }
}
