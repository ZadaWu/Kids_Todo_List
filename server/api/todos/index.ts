import { useTodos } from '~/model/todosMysql'
import { verifyAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const todosModel = useTodos()

  await verifyAuth(event, { required: true, parseToken: true })

  // 获取用户信息
  const user = event.context.user
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  // GET /api/todos - 获取所有todos
  if (event.method === 'GET') {
    return await todosModel.getTodos(user.uid)
  }

  // POST /api/todos - 创建新todo
  if (event.method === 'POST') {
    const body = await readBody(event)
    return await todosModel.addTodo({
      title: body.title,
      is_completed: false,
      created_at: new Date(),
      list_id: body.list_id,
      firebaseUid: body.firebaseUid
    })
  }
})
