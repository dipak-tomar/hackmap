import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with optimized connection settings
const createPrismaClient = () => {
  try {
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
  } catch (error) {
    console.error("Failed to create Prisma client:", error)
    // Return a minimal client for build-time compatibility
    return new PrismaClient({
      log: ["error"],
      errorFormat: "minimal",
    })
  }
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
