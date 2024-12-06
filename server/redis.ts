import Redis from 'ioredis'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()

// 主 Redis 客户端
const redis = new Redis({
  host: config.redis.host as string,
  port: config.redis.port as number
})

// 订阅专用客户端
const subscriber = new Redis({
  host: config.redis.pubSubHost as string,
  port: config.redis.pubSubPort as number
})

// 发布专用客户端
const publisher = new Redis({
  host: config.redis.pubSubHost as string,
  port: config.redis.pubSubPort as number
})

export { redis as default, subscriber, publisher }