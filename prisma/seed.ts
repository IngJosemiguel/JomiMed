import { PrismaClient } from "@prisma/client";
import { PasswordService } from "../src/infrastructure/security/password.service";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    // 1. Create Clinic
    const clinic = await prisma.clinic.upsert({
        where: { slug: "clinica-demo" },
        update: {},
        create: {
            name: "Clínica Demo",
            slug: "clinica-demo",
            status: "ACTIVE",
            subscriptionPlan: "ENTERPRISE",
            primaryColor: "#0070f3",
        },
    });

    console.log("Clinic created:", clinic.name);

    // 2. Create Roles
    const adminRole = await prisma.role.create({
        data: {
            name: "SuperAdmin",
            description: "Full system access",
            permissions: JSON.stringify(["*"]),
            clinicId: clinic.id,
        },
    });

    console.log("Role created:", adminRole.name);

    // 3. Create Admin User
    const hashedPassword = await PasswordService.hash("password123");

    const admin = await prisma.user.upsert({
        where: { email: "admin@demo.com" },
        update: {},
        create: {
            email: "admin@demo.com",
            passwordHash: hashedPassword,
            firstName: "Admin",
            lastName: "User",
            clinicId: clinic.id,
            roleId: adminRole.id,
        },
    });

    console.log("Admin User created:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
