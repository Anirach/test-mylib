import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma
}

export default prisma

// Utility function to disconnect from database
export const disconnectDatabase = async () => {
  await prisma.$disconnect()
}

// Utility function to check database connection
export const checkDatabaseConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}
