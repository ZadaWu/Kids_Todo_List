import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

let supabaseInstance: any = null

export const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance
  }
  // In Nuxt 3, we should use runtime config instead of process.env
  // Access environment variables through useRuntimeConfig()
  const config = useRuntimeConfig()
  supabaseInstance = createClient(
    config.public.supabaseUrl + '',
    config.public.supabaseAnonKey + ''
  )

  return supabaseInstance
}
