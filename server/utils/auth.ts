import { adminAuth } from '~/server/utils/firebase-admin'
import type { H3Event } from 'h3'

export interface AuthOptions {
  required?: boolean  // 是否必须验证
  parseToken?: boolean  // 是否解析token
}

export const verifyAuth = async (event: H3Event, options: AuthOptions = {}) => {
  const { required = true, parseToken = true } = options
  
  try {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      if (required) {
        throw createError({
          statusCode: 401,
          message: 'No token provided'
        })
      }
      return null
    }

    const token = authHeader.split('Bearer ')[1]
    if (!token && required) {
      throw createError({
        statusCode: 401,
        message: 'Invalid token format'
      })
    }

    if (parseToken && token) {
      const decodedToken = await adminAuth.verifyIdToken(token)
      // 将用户信息添加到事件上下文
      event.context.auth = decodedToken
      return decodedToken
    }

    return null
  } catch (error: any) {
    if (required) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Authentication failed'
      })
    }
    return null
  }
} 