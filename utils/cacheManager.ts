import redis, { publisher } from '~/server/redis'
import { cacheManager } from '~/lib/cache'

interface CacheOptions {
  memCacheName: string;  // 内存缓存的名称
  redisKeyPrefix: string;  // Redis 缓存的键前缀
  ttl?: number;  // 缓存过期时间（秒）
}

export const useLayeredCache = () => {
  const getFromCache = async <T>(
    key: string,
    fetchData: () => Promise<T>,
    options: CacheOptions
  ) => {
    const { memCacheName, redisKeyPrefix, ttl } = options
    const memCache = cacheManager.createCache(memCacheName)
    const fullKey = `${redisKeyPrefix}:${key}`

    try {
      // 1. 尝试从内存缓存获取
      let data = memCache.get(key) as T
      if (data) {
        console.log('Data found in memory cache')
        return data
      }

      // 2. 尝试从 Redis 获取
      const redisData = await redis.hgetall(fullKey)
      if (redisData && Object.keys(redisData).length > 0) {
        console.log('Data found in Redis')
        // 将 Redis 中的字符串值转回对象
        data = Object.entries(redisData).reduce((acc: any, [field, value]) => {
          try {
            acc[field] = JSON.parse(value as string)
          } catch {
            acc[field] = value
          }
          return acc
        }, {}) as T

        // 存入内存缓存
        memCache.set(key, data)
        return data
      }

      // 3. 从数据源获取
      console.log('Fetching from data source')
      data = await fetchData()

      // 4. 存入缓存
      memCache.set(key, data)

      // 将对象值转为字符串后存入 Redis
      const redisHash = Array.isArray(data) 
        ? data.reduce((acc: any, item: any, index) => {
            acc[index] = JSON.stringify(item)
            return acc
          }, {})
        : Object.entries(data as any).reduce((acc: any, [field, value]) => {
            acc[field] = typeof value === 'object' ? JSON.stringify(value) : value
            return acc
          }, {})

      await redis.hmset(fullKey, redisHash)
      if (ttl) {
        await redis.expire(fullKey, ttl)
      }

      return data
    } catch (error) {
      console.error('Cache error:', error)
      throw error
    }
  }

  const invalidateCache = async (
    key: string,
    options: CacheOptions
  ) => {
    const { memCacheName, redisKeyPrefix } = options
    const memCache = cacheManager.createCache(memCacheName)
    const fullKey = `${redisKeyPrefix}:${key}`

    try {
      memCache.delete(key)
      await redis.del(fullKey)
    } catch (error) {
      console.error('Cache invalidation error:', error)
      throw error
    }
  }

  return {
    getFromCache,
    invalidateCache
  }
} 