export default defineEventHandler(async (event) => {
  // 排除不需要认证的路径
  if (event.path.startsWith('/api/public')) {
    return
  }

  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1]
    try {
      const { getAuth } = await import('firebase-admin/auth')
      const decodedToken = await getAuth().verifyIdToken(token)
      // 将用户信息添加到请求上下文
      event.context.user = decodedToken
    } catch (error) {
      console.error('Token verification failed:', error)
    }
  }
}) 