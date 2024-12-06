import { useLists } from '~/model/listMysql'
import redis from '~/server/redis'
import { cacheManager } from '~/lib/cache'

const listsMemCache = cacheManager.createCache('ListsMemCache');

export default defineEventHandler(async (event) => {
  await verifyAuth(event, { required: true, parseToken: true })
  const user = event.context.user
  
  
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const method = getMethod(event)
  const lists = useLists()

  // GET - 获取列表
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const firebaseUid = query.firebaseUid as string
      if (!firebaseUid) {
        throw createError({
          statusCode: 400,
          message: 'Firebase UID is required'
        })
      }

      // Try memory cache first
      let items = listsMemCache.get(`lists:${firebaseUid}`)

      console.log(38, 'items:', items)
      
      if (!items) {
        // Try Redis if not in memory cache
        items = await redis.hgetall(`lists:${firebaseUid}`)
        
        if (!items || Object.keys(items).length === 0) {
          // Query database if not in Redis
          items = await lists.getLists(firebaseUid)
          
          // Store results in both caches
          listsMemCache.set(`lists:${firebaseUid}`, items)
          
          // Convert items array to hash for Redis
          const itemsHash = items.reduce((acc: any, item: any) => {
            acc[item.id] = JSON.stringify(item)
            return acc
          }, {})
          
          // Store in Redis as hash
          await redis.hmset(`lists:${firebaseUid}`, itemsHash)
        } else {
          // Convert Redis string values back to objects
          items = Object.entries(items).reduce((acc: any, [key, value]) => {
            acc[key] = JSON.parse(value as string)
            return acc
          }, {})
        }
      }

      return {
        code: 200,
        data: items,
        message: 'success'
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Server error'
      })
    }
  }

  // POST - 创建新项目
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      // 数据验证
      if (!body.name || !body.firebaseUid) {
        throw createError({
          statusCode: 400,
          message: 'Name and firebaseUid are required'
        })
      }

      // 创建记录
      const newItem = await lists.addList({
        name: body.name,
        firebaseUid: body.firebaseUid
      })

      return {
        code: 200,
        data: newItem,
        message: 'Created successfully'
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Server error'
      })
    }
  }
})
