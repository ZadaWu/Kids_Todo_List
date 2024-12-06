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
  const id = event.context.params?.id
  const lists = useLists()

  // 验证 ID
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  // GET - 获取单个项目
  if (method === 'GET') {
    try {
      // 注意：这里可能需要添加获取单个列表的方法到 listMysql.ts
      // 目前 listMysql.ts 中没有获取单个列表的方法
      const list = await lists.getList(Number(id))
      return {
        code: 200,
        data: list,
        message: 'success'
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Server error'
      })
    }
  }

  // PUT - 更新项目
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const updatedItem = await lists.updateList(Number(id), body.name)

      return {
        code: 200,
        data: updatedItem,
        message: 'Updated successfully'
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Server error'
      })
    }
  }

  // DELETE - 删除项目
  if (method === 'DELETE') {
    try {
      await lists.deleteList(Number(id))

      return {
        code: 200,
        message: 'Deleted successfully'
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error instanceof Error ? error.message : 'Server error'
      })
    }
  }
})
