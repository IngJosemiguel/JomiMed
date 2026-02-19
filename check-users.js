const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            email: { in: ["doctor@jomimed.com", "patient@jomimed.com"] }
        },
        select: {
            email: true,
            isActive: true,
            role: { select: { name: true } }
        }
    });

    console.log("Current Users Status:");
    console.table(users);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
