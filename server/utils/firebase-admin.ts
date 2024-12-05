import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { useRuntimeConfig } from '#imports'

const config = useRuntimeConfig()
let app: App | undefined

// 确保只初始化一次
if (!getApps().length) {
  try {
    console.log(11, config.public.firebaseAdminProjectId, config.public.firebaseAdminClientEmail, config.public.firebaseAdminPrivateKey)
    app = initializeApp({
      credential: cert({
        projectId: config.public.firebaseAdminProjectId,
        clientEmail: config.public.firebaseAdminClientEmail,
        privateKey: config.public.firebaseAdminPrivateKey?.replace(/\\n/g, '\n')
      })
    })
    console.log('Firebase Admin initialized successfully')
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
    throw error
  }
}

// 导出初始化后的实例
export const adminApp = app || getApps()[0]
export const adminAuth = getAuth(adminApp) 