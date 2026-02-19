import prisma from "@/lib/prisma";

export enum AuditAction {
    LOGIN = "LOGIN",
    LOGOUT = "LOGOUT",
    CREATE = "CREATE",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    ACCESS_DENIED = "ACCESS_DENIED",
}

export class AuditService {
    static async log(clinicId: string, userId: string, action: AuditAction, entity: string, details?: string, ip?: string) {
        try {
            await prisma.auditLog.create({
                data: {
                    clinicId,
                    userId,
                    action,
                    resource: entity, // Mapped to 'resource' field in DB
                    details: details as any, // Cast to any/Json
                    ipAddress: ip
                }
            });
        } catch (error) {
            console.error("Failed to write audit log", error);
        }
    }
}
