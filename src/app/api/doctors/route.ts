import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";

export const GET = apiHandler(async (req) => {
    const clinicId = req.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json([], { status: 200 });

    const doctors = await prisma.user.findMany({
        where: {
            clinicId: clinicId,
            role: {
                name: { contains: "DOCTOR", mode: "insensitive" }
            }
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
        }
    });

    return NextResponse.json(doctors);
});

export const POST = apiHandler(async (req) => {
    const clinicId = req.headers.get("x-clinic-id");
    if (!clinicId) throw new Error("Clinic ID missing");

    const body = await req.json();
    const { firstName, lastName, email, password, specialization, medicalLicense } = body;

    // 1. Find or Create DOCTOR role
    let doctorRole = await prisma.role.findFirst({
        where: { clinicId, name: 'DOCTOR' }
    });

    if (!doctorRole) {
        doctorRole = await prisma.role.create({
            data: {
                clinicId,
                name: 'DOCTOR',
                description: 'Medical Practitioner',
                permissions: ['patient:read', 'patient:write', 'appointment:read', 'appointment:write', 'record:read', 'record:write']
            }
        });
    }

    // 2. Hash Password
    // Import dynamically to avoid circular dependency issues if any
    const { PasswordService } = await import("@/infrastructure/security/password.service");
    const hashedPassword = await PasswordService.hash(password);

    // 3. Create User
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            firstName,
            lastName,
            specialization, // New Field
            medicalLicense, // New Field
            clinicId,
            roleId: doctorRole.id
        }
    });

    return NextResponse.json(user, { status: 201 });
});
