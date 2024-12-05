export default defineEventHandler(async (event) => {
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