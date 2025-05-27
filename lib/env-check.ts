// Environment validation utility
export function validateEnvironment() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:')
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`)
    })
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    } else {
      console.warn('⚠️  Some environment variables are missing. The app may not work correctly.')
    }
  } else {
    console.log('✅ All required environment variables are present')
  }
}

// Check if we're in a build environment
export function isBuildTime(): boolean {
  return process.env.VERCEL_ENV === 'preview' || 
         process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL ||
         process.argv.includes('build')
}

// Safe environment getter with fallbacks
export function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name]
  
  if (!value) {
    if (fallback !== undefined) {
      return fallback
    }
    
    if (isBuildTime()) {
      console.warn(`Environment variable ${name} not found, using placeholder for build`)
      return `placeholder_${name.toLowerCase()}`
    }
    
    throw new Error(`Environment variable ${name} is required`)
  }
  
  return value
}

// Database URL with build-time safety
export function getDatabaseUrl(): string {
  if (isBuildTime()) {
    return 'postgresql://placeholder:placeholder@localhost:5432/placeholder'
  }
  
  return getEnvVar('DATABASE_URL')
}

// Validate environment on module load (only in production)
if (process.env.NODE_ENV === 'production' && !isBuildTime()) {
  validateEnvironment()
} 