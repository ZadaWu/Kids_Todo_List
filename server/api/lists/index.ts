import { useLists } from '~/model/listMysql'

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

      const items = await lists.getLists(firebaseUid)

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
