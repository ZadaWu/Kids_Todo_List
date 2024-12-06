import { useTodos } from '~/model/todosMysql'

export default defineEventHandler(async (event) => {
  await verifyAuth(event, { required: true, parseToken: true })

  const todosModel = useTodos()
  const id = parseInt(event.context.params?.id as string)

  // 获取用户信息
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // PATCH /api/todos/[id] - 更新todo状态
  if (event.method === 'PATCH') {
    const body = await readBody(event)
    return await todosModel.updateTodo(id, body.is_completed)
  }

  // DELETE /api/todos/[id] - 删除todo
  if (event.method === 'DELETE') {
    return await todosModel.deleteTodo(id)
  }

  // 如果不是支持的方法，返回405错误
  throw createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
})
