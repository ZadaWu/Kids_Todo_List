import { CacheQueue } from '../../queue/cacheQueue'

let cacheQueue: CacheQueue | null = null

export function getCacheQueue() {
  if (!cacheQueue) {
    cacheQueue = new CacheQueue()
    cacheQueue.startProcessing()
  }
  return cacheQueue
} 