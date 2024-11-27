<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'info',
        validator: (value) => ['info', 'warning', 'error', 'success'].includes(value)
    },
    message: {
        type: String,
        required: true
    },
    show: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])

// 根据类型返回对应的图标和颜色
const notificationConfig = {
    info: {
        icon: 'ℹ️',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-200'
    },
    warning: {
        icon: '⚠️',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
    },
    error: {
        icon: '⛔',
        bgColor: 'bg-red-50',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
    },
    success: {
        icon: '✓',
        bgColor: 'bg-green-50',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
    }
}
</script>

<template>
    <Transition name="notification">
        <div v-if="show"
             :class="[
                'flex items-center justify-between px-4 py-3 rounded-md border',
                notificationConfig[type].bgColor,
                notificationConfig[type].textColor,
                notificationConfig[type].borderColor
             ]">
            <div class="flex items-center gap-2">
                <span class="text-lg">{{ notificationConfig[type].icon }}</span>
                <span class="font-medium">{{ type.charAt(0).toUpperCase() + type.slice(1) }}:</span>
                <span>{{ message }}</span>
            </div>
            <button @click="emit('close')" 
                    class="hover:opacity-75">
                ✕
            </button>
        </div>
    </Transition>
</template>

<style scoped>
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}
</style>
