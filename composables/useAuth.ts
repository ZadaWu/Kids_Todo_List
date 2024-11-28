import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from 'firebase/auth'

export const useAuth = () => {
  const user = useState<any | null>('user', () => null)
  const { $firebaseAuth } = useNuxtApp()
  
  // 注册
  const register = async (email: string, password: string) => {
    try {
      if (!$firebaseAuth) {
        throw new Error('Firebase auth is not initialized')
      }
      console.log(23, $firebaseAuth)
      const { user: newUser } = await createUserWithEmailAndPassword($firebaseAuth, email, password)
      user.value = newUser
      return newUser
    } catch (error: any) {
      console.error('Registration error:', error.code, error.message)
      throw error
    }
  }

  // 登录
  const login = async (email: string, password: string) => {
    try {
      const { user: authUser } = await signInWithEmailAndPassword($firebaseAuth, email, password)
      user.value = authUser
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // 登出
  const signOut = async () => {
    try {
      await firebaseSignOut($firebaseAuth)
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
    signOut
  }
} 