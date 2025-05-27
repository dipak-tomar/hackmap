import { prisma } from "./prisma"

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Helper function to execute database operations with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await operation()
  } catch (error: any) {
    // Check if it's a connection pool timeout error
    if (error.code === 'P2024' && retries > 0) {
      console.log(`Database connection timeout, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`)
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      
      // Try to refresh the connection
      try {
        await prisma.$disconnect()
        await prisma.$connect()
      } catch (connectError) {
        console.warn('Failed to refresh connection:', connectError)
      }
      
      return withRetry(operation, retries - 1)
    }
    
    throw error
  }
}

// Helper function to safely execute database operations
export async function safeDbOperation<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await withRetry(operation)
  } catch (error: any) {
    console.error('Database operation failed:', error)
    
    if (fallback !== undefined) {
      return fallback
    }
    
    throw error
  }
}

// Connection health check
export async function checkDbConnection(): Promise<boolean> {
  try {
    // Skip health check during build time
    if (process.env.VERCEL_ENV === 'preview' || !process.env.DATABASE_URL) {
      return true
    }
    
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  }
}

// Force connection refresh
export async function refreshConnection(): Promise<void> {
  try {
    // Skip refresh during build time
    if (process.env.VERCEL_ENV === 'preview' || !process.env.DATABASE_URL) {
      return
    }
    
    await prisma.$disconnect()
    await prisma.$connect()
    console.log('Database connection refreshed')
  } catch (error) {
    console.error('Failed to refresh database connection:', error)
    throw error
  }
} 