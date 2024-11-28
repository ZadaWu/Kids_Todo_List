<script setup>
import { useAuth } from '~/composables/useAuth'

const { user, signOut } = useAuth()

const handleSignOut = async () => {
  try {
    await signOut()
    // 可以添加退出成功的提示
  } catch (error) {
    console.error('退出失败:', error)
  }
}
</script>

<template>
  <div>
    <!-- 导航栏 -->
    <nav class="flex justify-between items-center px-8 py-4">
      <div class="text-2xl font-bold">FamilyTodo</div>
      <div class="flex items-center gap-4">
        <template v-if="user">
          <span class="text-gray-600">{{ user.email }}</span>
          <button 
            @click="handleSignOut"
            class="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            退出
          </button>
          <NuxtLink 
            to="/todos" 
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            我的待办
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink 
            to="/login" 
            class="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            登录
          </NuxtLink>
          <NuxtLink 
            to="/register" 
            class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            注册
          </NuxtLink>
        </template>
      </div>
    </nav>

    <!-- 主要内容区 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- 英雄区域 -->
      <div class="flex items-center justify-between py-20 bg-amber-50 rounded-2xl px-8 mt-8">
        <div class="max-w-xl">
          <h1 class="text-4xl font-bold mb-4">
            让家庭任务管理变得简单有趣
          </h1>
          <p class="text-gray-600 text-lg mb-8">
            不只是一个待办清单，更是家庭协作的革新。让孩子学会自我管理，
            帮助父母更好地分配家务，让每个家庭成员都能轻松参与。
          </p>
          <div class="space-x-4">
            <NuxtLink 
              to="/register" 
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              立即开始
            </NuxtLink>
            <NuxtLink 
              to="/about" 
              class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              了解更多
            </NuxtLink>
          </div>
        </div>
        
        <!-- 右侧插图 -->
        <div class="w-1/2">
          <img src="../public/assets/images/family-illustration.png" alt="Family illustration" />
        </div>
      </div>

      <!-- 特性展示 -->
      <div class="grid grid-cols-3 gap-8 my-20">
        <div class="p-6 rounded-lg bg-white shadow-sm">
          <div class="text-2xl mb-2">👶</div>
          <h3 class="text-xl font-semibold mb-2">培养孩子的自主能力</h3>
          <p class="text-gray-600">通过有趣的任务管理，让孩子学会规划时间和负责任。</p>
        </div>
        
        <div class="p-6 rounded-lg bg-white shadow-sm">
          <div class="text-2xl mb-2">👨‍👩‍👧‍👦</div>
          <h3 class="text-xl font-semibold mb-2">家庭协作新方式</h3>
          <p class="text-gray-600">公平分配家务，让每个家庭成员都能参与其中。</p>
        </div>

        <div class="p-6 rounded-lg bg-white shadow-sm">
          <div class="text-2xl mb-2">🌈</div>
          <h3 class="text-xl font-semibold mb-2">趣味化任务系统</h3>
          <p class="text-gray-600">通过奖励机制和有趣的界面设计，让任务变得更有趣。</p>
        </div>
      </div>

      <!-- 用户见证 -->
      <div class="text-center mb-20">
        <div class="max-w-3xl mx-auto">
          <p class="text-xl text-gray-600 italic">
            "自从使用了这个应用，我家的孩子变得更加主动，家务分配也更加合理了！"
          </p>
          <div class="mt-4">
            <img 
              src="../public/assets/images/avatar.png" 
              alt="User avatar" 
              class="w-12 h-12 rounded-full mx-auto mb-2"
            />
            <p class="font-medium">李妈妈，两个孩子的母亲</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-50 py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-4 gap-8">
          <div>
            <h4 class="font-bold mb-4">产品</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/features">功能</NuxtLink></li>
              <li><NuxtLink to="/pricing">价格</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">资源</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/blog">博客</NuxtLink></li>
              <li><NuxtLink to="/guide">使用指南</NuxtLink></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-4">关于</h4>
            <ul class="space-y-2">
              <li><NuxtLink to="/about">关于我们</NuxtLink></li>
              <li><NuxtLink to="/contact">联系我们</NuxtLink></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>