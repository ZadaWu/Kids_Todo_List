// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
        supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY,
        firebaseApiKey: process.env.FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.FIREBASE_APP_ID,
        firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
        mysqlHost: process.env.MYSQL_HOST,
        mysqlUser: process.env.MYSQL_USER,
        mysqlPassword: process.env.MYSQL_PASSWORD,
        mysqlDatabase: process.env.MYSQL_DATABASE
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
    },
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  plugins: [
    '~/plugins/firebase.ts'
  ],
  buildModules: [
    // 仅支持 Nuxt 2:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ]
})
