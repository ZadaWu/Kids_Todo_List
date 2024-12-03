import { Redis } from 'ioredis'

// 确保只在服务器端创建 Redis 实例
let redis: Redis

if (process.server) {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379
  })
}

export default redis 