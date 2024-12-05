import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from 'firebase/auth'
import { useUserStore } from '~/state/userStore'

export const useAuth = () => {
  const user = useState<any | null>('user', () => null)
  const { $firebaseAuth } = useNuxtApp()
  const userStore = useUserStore()
  
  // 保存用户信息到 Redis (通过 API)
  const saveUserToCache = async (firebaseUser: any) => {
    try {
      console.log(31, 'saveUserToCache')
      const response = await fetch('/api/users/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId || 'anonymous',
        })
      })
      console.log(32)
      return await response.json()
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    }
  }

  // 注册
  const register = async (email: string, password: string) => {
    try {
      if (!$firebaseAuth) {
        throw new Error('Firebase auth is not initialized')
      }
      const { user: firebaseUser } = await createUserWithEmailAndPassword($firebaseAuth, email, password)
      const userData = await saveUserToCache(firebaseUser)
      user.value = { ...firebaseUser, userData }
      return user.value
    } catch (error: any) {
      console.error('Registration error:', error.code, error.message)
      throw error
    }
  }

  // Google登录
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const { user: firebaseUser } = await signInWithPopup($firebaseAuth, provider)
      const userData = await saveUserToCache(firebaseUser)
      user.value = { ...firebaseUser, userData }
      userStore.setUser(user.value)
      return user.value
    } catch (error) {
      console.error('Google login error:', error)
      throw error
    }
  }

  // 普通登录
  const login = async (email: string, password: string) => {
    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword($firebaseAuth, email, password)
      const userData = await saveUserToCache(firebaseUser)
      user.value = { ...firebaseUser, userData }
      userStore.setUser(user.value)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // 匿名登录
  const loginAnonymously = async () => {
    try {
      const { user: firebaseUser } = await signInAnonymously($firebaseAuth)
      const userData = await saveUserToCache(firebaseUser)
      user.value = { ...firebaseUser, userData }
      return user.value
    } catch (error) {
      console.error('Anonymous login error:', error)
      throw error
    }
  }

  // 登出
  const signOut = async () => {
    try {
      await firebaseSignOut($firebaseAuth)
      if (user.value?.uid) {
        await fetch('/api/users/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            uid: user.value.uid,
          })
        })
      }
      user.value = null
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  return {
    user,
    register,
    login,
    signOut,
    loginWithGoogle,
    loginAnonymously
  }
} 