import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL;

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaDB = globalThis.prisma || new PrismaClient({
  // Specify the connection URL for PostgreSQL
  datasources: {
    db: {
      url: connectionString,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prismaDB;
}

export default prismaDB;
