import redis from '~/server/redis'
import { cacheManager } from '~/lib/cache'

const userMemCache = cacheManager.createCache('userMemCache');

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userData = {
      ...body,
      lastLogin: new Date().toISOString()
    }
    // Store user data in memory cache
    userMemCache.set(`user:${body.uid}`, userData)

    // Store user data in Redis
    await redis.hset(`user:${body.uid}`, userData)

    // Store user data in MySQL
    const { upsertUser } = await import('~/model/user');
    await upsertUser({
      firebaseUid: body.uid,
      email: body.email, 
      displayName: body.displayName,
      photoUrl: body.photoURL,
      provider: body.provider,
      lastLogin: new Date().toISOString()
    });
    return { status: 'success', data: userData }
  } catch (error: any) {
    console.error('Error saving user data:', error)
    return { status: 'error', message: error?.message || 'Unknown error' }
  }
}) 