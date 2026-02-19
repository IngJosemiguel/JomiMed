import { PrismaClient } from "@prisma/client";
import { AuthRepository } from "../src/infrastructure/persistence/AuthRepository";
import { LoginUseCase } from "../src/core/application/use-cases/LoginUseCase";

const prisma = new PrismaClient();

async function main() {
    console.log("--- START DEBUG ---");
    try {
        const email = "admin@demo.com";
        const password = "password123";

        console.log(`Testing Login for: ${email}`);

        // 1. Check DB directly
        const user = await prisma.user.findUnique({
            where: { email },
            include: { clinic: true, role: true }
        });
        console.log("DB User found:", user ? "YES" : "NO");
        if (user) {
            console.log("User Clinic:", user.clinic?.name);
            console.log("User Role:", user.role?.name);
            console.log("Password Hash:", user.passwordHash.substring(0, 10) + "...");
        } else {
            console.error("User not found in DB! Seed might not have run.");
            return;
        }

        // 2. Test Repository
        const repo = new AuthRepository();
        const repoUser = await repo.findByEmail(email);
        console.log("Repo User found:", repoUser ? "YES" : "NO");

        // 3. Test Use Case
        console.log("Executing LoginUseCase...");
        const useCase = new LoginUseCase(repo);
        const result = await useCase.execute({ email, password });
        console.log("Login Success!", result.accessToken ? "Token generated" : "No token");

    } catch (error) {
        console.error("--- ERROR CAUGHT ---");
        console.error(error);
    } finally {
        await prisma.$disconnect();
        console.log("--- END DEBUG ---");
    }
}

main();
