<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const handleBackdropClick = (e) => {
    if(props.show && e?.target === e?.currentTarget) {
        emit('close')
    }
}

</script>
<template>
    <!-- 模态框背景遮罩 -->
    <div v-if="show" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         @click="handleBackdropClick">
        <!-- 模态框主体 -->
        <div class="bg-white rounded-lg p-6 w-[400px] relative">
            <!-- 关闭按钮 -->
            <button 
                @click="emit('close')" 
                class="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
                ×
            </button>
            <!-- 模态框内容 -->
            <slot></slot>
        </div>
    </div>
</template>