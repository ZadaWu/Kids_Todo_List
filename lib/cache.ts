import { LRUCache } from 'lru-cache'

interface CacheOptions {
    max: number;
    ttl: number;
}

const defaultOptions: CacheOptions = {
    max: 1000,
    ttl: 1000 * 60 * 60 // 1 hour
}

// 创建缓存管理类
class CacheManager {
    private caches: Map<string, LRUCache<string, any>> = new Map()

    getCache(name: string): LRUCache<string, any> {
        const cache = this.caches.get(name)
        if (cache) {
            return cache
        } else {
            throw new Error(`Cache ${name} not found`)
        }
    }

    createCache(name: string, options: CacheOptions = defaultOptions): LRUCache<string, any> {
        const cache = new LRUCache<string, any>(options)
        this.caches.set(name, cache)
        return cache
    }

    clearCache(name: string) {
        this.caches.delete(name)
    }

    clearAllCaches() {
        this.caches.clear()
    }
}

export const cacheManager = new CacheManager()