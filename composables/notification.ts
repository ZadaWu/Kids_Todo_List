import { createApp, h } from 'vue'
import Notification from '@/components/notification.vue'

export interface NotificationOptions {
    type: 'info' | 'warning' | 'error' | 'success'
    message: string,
    duration?: number
}

export function useNotification() {
    const notifications = new Set()

    const createContainer = () => {
        const container = document.getElementById('notification-container') || (() => {
            const div = document.createElement('div')
            div.id = 'notification-container'
            document.body.appendChild(div)
            return div
        })()
        return container
    }

    const show = (options: NotificationOptions) => {
        const {type = 'info', message, duration = 3000} = options
        const notificationInstance = createApp({
            setup() {
                return () => h(Notification, { type, message, onClose:() => hide(notificationInstance) })
            }
        })
        const container = createContainer()
        const mountNode = document.createElement('div')
        container.appendChild(mountNode)

        notificationInstance.mount(mountNode)
        notifications.add(notificationInstance)

        if (duration) {
            setTimeout(() => {
                hide(notificationInstance)
            }, duration)
        }
        return notificationInstance
    }

    const hide = (notificationInstance: any) => {
        if (notifications.has(notificationInstance)) {
            notificationInstance.unmount()
            notificationInstance._container.remove();
            notifications.delete(notificationInstance)
        }
    }

    return {
        show,
        hide
    }
}

export const notification = useNotification()

