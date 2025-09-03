"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkDatabaseConnection = exports.disconnectDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = globalThis.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV === 'development') {
    globalThis.prisma = prisma;
}
exports.default = prisma;
const disconnectDatabase = async () => {
    await prisma.$disconnect();
};
exports.disconnectDatabase = disconnectDatabase;
const checkDatabaseConnection = async () => {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};
exports.checkDatabaseConnection = checkDatabaseConnection;
//# sourceMappingURL=database.js.map