import { Redis } from 'ioredis';

async function invalidateCache(table: string, id: number) {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  });

  try {
    await redis.publish('cache-invalidation', JSON.stringify({
      operation: 'delete',
      table,
      id,
      keys: [`${table}MemCache`]
    }));
    console.log(`Cache invalidation message sent for ${table}:${id}`);
  } catch (error) {
    console.error('Error sending cache invalidation message:', error);
  } finally {
    await redis.quit();
  }
}

// 使用示例：
const [,, table, id] = process.argv;
if (table && id) {
  invalidateCache(table, parseInt(id))
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}