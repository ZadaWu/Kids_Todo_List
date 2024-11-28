export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useAuth()
  
  // 如果用户未登录且访问的不是登录/注册页面，重定向到登录页
  if (!user.value && !['/login', '/register'].includes(to.path)) {
    return navigateTo('/login')
  }
  
  // 如果用户已登录且访问登录/注册页面，重定向到todos页面
  if (user.value && ['/login', '/register'].includes(to.path)) {
    return navigateTo('/todos')
  }
}) 