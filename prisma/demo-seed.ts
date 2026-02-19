import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Demo Data for Screenshots...");

    // 1. Ensure Clinic Exists
    const clinic = await prisma.clinic.upsert({
        where: { slug: "demo-clinic" },
        update: {},
        create: {
            name: "JomiMed Demo Clinic",
            slug: "demo-clinic",
            // address & phone are likely in a JSON settings field or not in MVP schema
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
        update: {},
        create: {
            email: "doctor@jomimed.com",
            passwordHash: doctorPassword,
            firstName: "Juan",
            lastName: "Pérez",
            roleId: doctorRole.id,
            clinicId: clinic.id,
        },
    });

    console.log(`👨‍⚕️ Doctor Created: ${doctor.email} / doctor123`);

    // 4. Create Patient
    const patient = await prisma.patient.upsert({
        where: { clinicId_documentNumber: { clinicId: clinic.id, documentNumber: "87654321" } },
        update: {},
        create: {
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

    // 4b. Create Patient User Login
    const patientPassword = await hash("patient123", 10);
    await prisma.user.upsert({
        where: { email: "patient@jomimed.com" },
        update: {},
        create: {
            email: "patient@jomimed.com",
            passwordHash: patientPassword,
            firstName: "Maria",
            lastName: "Gomez", // Match patient
            roleId: patientRole.id,
            clinicId: clinic.id,
        }
    });

    console.log(`👩‍🦰 Patient Created: ${patient.email} / patient123`);

    // 5. Create Appointments (Past & Future)
    // Future Appointment
    await prisma.appointment.create({
        data: {
            datetime: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
            status: "SCHEDULED",
            reason: "Annual Cardiac Checkup",
            patientId: patient.id,
            doctorId: doctor.id,
            clinicId: clinic.id,
        }
    });

    // Past Appointment (Completed)
    await prisma.appointment.create({
        data: {
            datetime: new Date(new Date().setDate(new Date().getDate() - 10)), // 10 days ago
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
