import { useLists } from '~/model/listMysql'
import { useLayeredCache } from '~/utils/cacheManager'

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
  const { getFromCache, invalidateCache } = useLayeredCache()

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

      const data = await getFromCache(
        firebaseUid,
        () => lists.getLists(firebaseUid),
        {
          memCacheName: 'ListsMemCache',
          redisKeyPrefix: 'lists',
          ttl: 3600 // 1小时过期
        }
      )

      return {
        code: 200,
        data,
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
      
      if (!body.name || !body.firebaseUid) {
        throw createError({
          statusCode: 400,
          message: 'Name and firebaseUid are required'
        })
      }

      const newItem = await lists.addList(body)

      // 清除缓存
      await invalidateCache(body.firebaseUid, {
        memCacheName: 'ListsMemCache',
        redisKeyPrefix: 'lists'
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
