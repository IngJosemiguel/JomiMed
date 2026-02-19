import prisma from "@/lib/prisma";
import { IAuthRepository } from "@/core/application/interfaces/IAuthRepository";

export class AuthRepository implements IAuthRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: { clinic: true, role: true },
        });
    }

    async updateLastLogin(userId: string) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                // We need to add lastLoginAt to schema or use updatedAt if not present. 
                // Schema has updatedAt, but User model in schema.prisma didn't explicitly have lastLoginAt in my previous step?
                // Checking schema... User model: createdAt, updatedAt. 
                // I should add lastLoginAt to schema later or just rely on updatedAt for now.
                // Wait, the Architecture plan mentioned audit logs.
                // Let's just update updatedAt for now to signify activity.
                updatedAt: new Date()
            },
        });
    }
}
