import { User, Clinic, Role } from "@prisma/client";

export interface IAuthRepository {
    findByEmail(email: string): Promise<(User & { clinic: Clinic; role: Role }) | null>;
    updateLastLogin(userId: string): Promise<void>;
}
