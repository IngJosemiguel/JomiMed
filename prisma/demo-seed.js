const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Demo Data (JS Mode)...");

    // 1. Ensure Clinic Exists
    const clinic = await prisma.clinic.upsert({
        where: { slug: "demo-clinic" },
        update: {},
        create: {
            name: "JomiMed Demo Clinic",
            slug: "demo-clinic",
            status: "ACTIVE",
        },
    });

    console.log(`🏥 Clinic: ${clinic.name}`);

    // 2. Ensure Roles Exist
    let doctorRole = await prisma.role.findFirst({ where: { name: "DOCTOR", clinicId: clinic.id } });
    if (!doctorRole) {
        doctorRole = await prisma.role.create({
            data: {
                name: "DOCTOR",
                description: "Medical Doctor",
                clinicId: clinic.id,
                permissions: ["patient:read", "patient:write", "appointment:read", "appointment:write", "medical-record:read", "medical-record:write"],
            },
        });
    }

    let patientRole = await prisma.role.findFirst({ where: { name: "PATIENT", clinicId: clinic.id } });
    if (!patientRole) {
        patientRole = await prisma.role.create({
            data: {
                name: "PATIENT",
                description: "Patient Access",
                clinicId: clinic.id,
                permissions: ["portal:access"],
            },
        });
    }

    // 3. Create Doctor User
    const doctorPassword = await hash("doctor123", 10);
    const doctor = await prisma.user.upsert({
        where: { email: "doctor@jomimed.com" },
        update: {
            isActive: true, // Force active
            passwordHash: doctorPassword, // Reset password to ensure it matches
        },
        create: {
            email: "doctor@jomimed.com",
            passwordHash: doctorPassword,
            firstName: "Juan",
            lastName: "Pérez",
            roleId: doctorRole.id,
            clinicId: clinic.id,
            isActive: true
        },
    });

    console.log(`👨‍⚕️ Doctor Created: ${doctor.email} / doctor123`);

    // 4. Create Patient
    // Use findFirst then create/update to avoid unique constraint complexities if schema drifted
    let patient = await prisma.patient.findFirst({
        where: { documentNumber: "87654321", clinicId: clinic.id }
    });

    if (!patient) {
        patient = await prisma.patient.create({
            data: {
                firstName: "Maria",
                lastName: "Gomez",
                dateOfBirth: new Date("1990-05-15"),
                gender: "Female",
                documentNumber: "87654321",
                email: "patient@jomimed.com",
                phone: "+51 987 654 321",
                address: "Calle Los Pinos 456, San Isidro",
                clinicId: clinic.id,
            }
        });
    }

    // 4b. Create Patient User Login
    const patientPassword = await hash("patient123", 10);
    await prisma.user.upsert({
        where: { email: "patient@jomimed.com" },
        update: {
            isActive: true, // Force active
            passwordHash: patientPassword, // Reset password
        },
        create: {
            email: "patient@jomimed.com",
            passwordHash: patientPassword,
            firstName: "Maria",
            lastName: "Gomez",
            roleId: patientRole.id,
            clinicId: clinic.id,
            isActive: true
        }
    });

    console.log(`👩‍🦰 Patient Created: ${patient.email} / patient123`);

    // 5. Create Appointments
    await prisma.appointment.create({
        data: {
            datetime: new Date(new Date().setDate(new Date().getDate() + 2)),
            status: "SCHEDULED",
            reason: "Annual Cardiac Checkup",
            patientId: patient.id,
            doctorId: doctor.id,
            clinicId: clinic.id,
        }
    });

    await prisma.appointment.create({
        data: {
            datetime: new Date(new Date().setDate(new Date().getDate() - 10)),
            status: "COMPLETED",
            reason: "Hypertension Follow-up",
            patientId: patient.id,
            doctorId: doctor.id,
            clinicId: clinic.id,
        }
    });

    console.log("📅 Appointments Created");
    console.log("✅ Demo Data Seeding Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
