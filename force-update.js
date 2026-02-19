const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
    console.log("🔥 FORCING UPDATE on Neon DB...");

    // 1. Force update Doctor
    const doctor = await prisma.user.update({
        where: { email: "doctor@jomimed.com" },
        data: { isActive: true }
    });
    console.log(`✅ Doctor Updated: ${doctor.email}, isActive: ${doctor.isActive}`);

    // 2. Force update Patient
    const patient = await prisma.user.update({
        where: { email: "patient@jomimed.com" },
        data: { isActive: true }
    });
    console.log(`✅ Patient Updated: ${patient.email}, isActive: ${patient.isActive}`);
}

main()
    .catch(e => {
        console.error("❌ ERROR:", e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
