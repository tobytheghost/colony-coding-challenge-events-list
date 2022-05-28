export const createCacheKeyFromArgs = (args: any[]) =>
  args.reduce(
    (cacheKey, arg) =>
      (cacheKey += `_${
        typeof arg === 'object' ? JSON.stringify(args) : `${arg}`
      }_`),
    ''
  )

const memoize: (...args: any[]) => any = fn => {
  const cache = new Map()
  return async function () {
    const cacheKey = createCacheKeyFromArgs(Array.from(arguments))
    if (cache.has(cacheKey)) return cache.get(cacheKey)
    const asyncFn = fn.apply(undefined, arguments)
    cache.set(cacheKey, asyncFn)
    return asyncFn
  }
}

export default memoize
