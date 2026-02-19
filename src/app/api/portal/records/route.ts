import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";

export const GET = apiHandler(async (req) => {
    const userId = req.headers.get("x-user-id");
    if (!userId) throw new Error("User ID missing");

    // 1. Get User Email
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, clinicId: true }
    });

    if (!user || !user.email) {
        return NextResponse.json([]);
    }

    // 2. Find Patient by Email
    const patient = await prisma.patient.findFirst({
        where: {
            clinicId: user.clinicId,
            email: user.email
        }
    });

    if (!patient) {
        return NextResponse.json([]);
    }

    // 3. Fetch Medical Records
    const records = await prisma.medicalRecord.findMany({
        where: {
            patientId: patient.id
        },
        include: {
            doctor: {
                select: {
                    firstName: true,
                    lastName: true,
                    specialization: true
                }
            }
        },
        orderBy: {
            date: 'desc'
        }
    });

    return NextResponse.json(records);
});
