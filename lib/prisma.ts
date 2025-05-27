import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with optimized connection settings
const createPrismaClient = () => {
  const client = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    errorFormat: "minimal",
  })

  // Add middleware to handle connection cleanup
  client.$use(async (params, next) => {
    const before = Date.now()
    try {
      const result = await next(params)
      return result
    } catch (error) {
      console.error(`Prisma query error in ${params.model}.${params.action}:`, error)
      throw error
    } finally {
      const after = Date.now()
      if (process.env.NODE_ENV === "development") {
        console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
      }
    }
  })

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown handlers
const gracefulShutdown = async () => {
  console.log('Disconnecting Prisma client...')
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
