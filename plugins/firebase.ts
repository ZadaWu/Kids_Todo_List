import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin((nuxtApp) => {
  try {
    const config = useRuntimeConfig()
    
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
      measurementId: config.public.firebaseMeasurementId
    }
    
    // 初始化 Firebase
    const app = initializeApp(firebaseConfig)
    
    // 获取 Firebase 服务实例
    const auth = getAuth(app)
    const db = getFirestore(app)

    // 使用 vueApp.config.globalProperties 来提供全局属性
    if (process.client) {
      nuxtApp.vueApp.config.globalProperties.$firebaseAuth = auth
      nuxtApp.vueApp.config.globalProperties.$firebaseDb = db
    }

    return {
      provide: {
        firebaseAuth: auth,
        firebaseDb: db
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error)
    throw error
  }
})