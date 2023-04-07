/**
 * clone
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'
import { DataObjectType } from '@/types/basic'

export const clone = (target: any, property_name: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value
  descriptor.value = async function (this: DataObjectType, ...args: any[]) {
    let is_loading = this.isLoading()
    let result = await method.apply(
      this,
      is_loading
        ? args
        : args.map((i) => {
            return i && typeof i === 'object' ? lodash.cloneDeep(i) : i
          }),
    )
    if (!is_loading && result && typeof result === 'object') {
      result = lodash.cloneDeep(result)
    }

    return result
  }
  return descriptor
}
