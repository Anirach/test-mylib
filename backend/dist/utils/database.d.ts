import { PrismaClient } from '@prisma/client';
declare global {
    var prisma: PrismaClient | undefined;
}
declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export default prisma;
export declare const disconnectDatabase: () => Promise<void>;
export declare const checkDatabaseConnection: () => Promise<boolean>;
//# sourceMappingURL=database.d.ts.map