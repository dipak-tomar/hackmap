// Database configuration for connection pooling
export const dbConfig = {
  // Connection pool settings
  connectionLimit: 10, // Reduced from default to prevent pool exhaustion
  connectionTimeout: 20000, // 20 seconds
  poolTimeout: 10000, // 10 seconds
  idleTimeout: 30000, // 30 seconds
  
  // Query settings
  queryTimeout: 30000, // 30 seconds
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 1000,
}

// Generate optimized DATABASE_URL with connection parameters
export function getOptimizedDatabaseUrl(baseUrl?: string): string {
  const url = baseUrl || process.env.DATABASE_URL
  
  if (!url) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Parse the URL to add connection parameters
  const urlObj = new URL(url)
  
  // Add connection pool parameters
  urlObj.searchParams.set('connection_limit', dbConfig.connectionLimit.toString())
  urlObj.searchParams.set('pool_timeout', (dbConfig.poolTimeout / 1000).toString())
  urlObj.searchParams.set('connect_timeout', (dbConfig.connectionTimeout / 1000).toString())
  
  // Add SSL settings for production
  if (process.env.NODE_ENV === 'production') {
    urlObj.searchParams.set('sslmode', 'require')
  }
  
  return urlObj.toString()
}

// Connection health monitoring
export class ConnectionMonitor {
  private static instance: ConnectionMonitor
  private healthCheckInterval?: NodeJS.Timeout
  
  static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor()
    }
    return ConnectionMonitor.instance
  }
  
  startMonitoring(checkInterval = 30000): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
    }
    
    this.healthCheckInterval = setInterval(async () => {
      try {
        const { checkDbConnection } = await import('./db-utils')
        const isHealthy = await checkDbConnection()
        
        if (!isHealthy) {
          console.warn('Database connection health check failed')
          // Attempt to refresh connection
          const { refreshConnection } = await import('./db-utils')
          await refreshConnection()
        }
      } catch (error) {
        console.error('Connection monitoring error:', error)
      }
    }, checkInterval)
  }
  
  stopMonitoring(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval)
      this.healthCheckInterval = undefined
    }
  }
}

// Auto-start monitoring in production
if (process.env.NODE_ENV === 'production') {
  ConnectionMonitor.getInstance().startMonitoring()
} 