import { CacheData } from './types'

const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

function getCacheKey(owner: string, repo: string): string {
  return `github-explorer-${owner}-${repo}`
}

export function getCachedData(owner: string, repo: string): CacheData | null {
  try {
    const key = getCacheKey(owner, repo)
    const cached = localStorage.getItem(key)
    
    if (!cached) return null
    
    const data: CacheData = JSON.parse(cached)
    const now = Date.now()
    
    // Check if cache is expired
    if (now - data.timestamp > CACHE_TTL) {
      localStorage.removeItem(key)
      return null
    }
    
    return data
  } catch (error) {
    console.warn('Failed to read cache:', error)
    return null
  }
}

export function setCachedData(owner: string, repo: string, data: Omit<CacheData, 'timestamp'>): void {
  try {
    const key = getCacheKey(owner, repo)
    const cacheData: CacheData = {
      ...data,
      timestamp: Date.now()
    }
    
    localStorage.setItem(key, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Failed to write cache:', error)
  }
}

export function updateCachedFileContent(owner: string, repo: string, filePath: string, content: string): void {
  try {
    const cached = getCachedData(owner, repo)
    if (cached) {
      cached.fileContents[filePath] = content
      setCachedData(owner, repo, {
        fileTree: cached.fileTree,
        fileContents: cached.fileContents
      })
    }
  } catch (error) {
    console.warn('Failed to update cached file content:', error)
  }
}

export function clearExpiredCaches(): void {
  try {
    const keys = Object.keys(localStorage)
    const now = Date.now()
    
    keys.forEach(key => {
      if (key.startsWith('github-explorer-')) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const data: CacheData = JSON.parse(cached)
            if (now - data.timestamp > CACHE_TTL) {
              localStorage.removeItem(key)
            }
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    })
  } catch (error) {
    console.warn('Failed to clear expired caches:', error)
  }
}