// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  transactionOptions: {
    maxWait: 10000, // Maximum time to wait for a transaction slot (10s)
    timeout: 15000, // Maximum time a transaction can run (15s)
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
