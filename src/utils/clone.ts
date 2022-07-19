/**
 * clone
 * @author: oldj
 * @homepage: https://oldj.net
 */

import lodash from 'lodash'

export const clone = (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value
  descriptor.value = async function (...args: any[]) {
    // @ts-ignore
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
