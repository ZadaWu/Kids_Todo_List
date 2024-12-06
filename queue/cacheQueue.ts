import redis, { subscriber, publisher } from '~/server/redis';
import { cacheManager } from '~/lib/cache';

interface CacheInvalidationPayload {
  operation: 'update' | 'delete';
  table: string;
  id: number | string;
  data?: any;
  memCacheName: string;
  redisKeyPrefix: string;
}

export class CacheQueue {
  // 发布缓存失效消息
  async publishCacheInvalidation(payload: CacheInvalidationPayload) {
    try {
      await publisher.publish('cache-invalidation', JSON.stringify(payload));
      console.log('Published cache invalidation:', payload);
    } catch (error) {
      console.error('Error publishing cache invalidation:', error);
    }
  }

  // 启动消息处理
  async startProcessing() {
    try {
      await subscriber.subscribe('cache-invalidation');
      
      subscriber.on('message', async (channel, message) => {
        if (channel === 'cache-invalidation') {
          const payload: CacheInvalidationPayload = JSON.parse(message);
          await this.processCacheInvalidation(payload);
        }
      });
    } catch (error) {
      console.error('Error in cache invalidation processing:', error);
    }
  }

  private async processCacheInvalidation(payload: CacheInvalidationPayload) {
    try {
      const { operation, table, id, data, memCacheName, redisKeyPrefix } = payload;
      const key = `${id}`;
      const fullKey = `${redisKeyPrefix}:${key}`;

      // 1. 清除内存缓存
      const memCache = cacheManager.createCache(memCacheName);
      memCache.delete(key);

      // 2. 处理Redis缓存
      if (operation === 'delete') {
        await redis.del(fullKey);
      } else if (operation === 'update' && data) {
        // 将对象值转为字符串后存入 Redis
        const redisHash = Array.isArray(data)
          ? data.reduce((acc: any, item: any, index) => {
              acc[index] = JSON.stringify(item);
              return acc;
            }, {})
          : Object.entries(data).reduce((acc: any, [field, value]) => {
              acc[field] = typeof value === 'object' ? JSON.stringify(value) : value;
              return acc;
            }, {});

        await redis.hmset(fullKey, redisHash);
      }

      console.log(`Cache invalidation processed for ${table}:${id}`);
    } catch (error) {
      console.error('Error processing cache invalidation:', error);
    }
  }
}