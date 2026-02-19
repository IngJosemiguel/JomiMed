import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";

// GET: List Medical Records
export const GET = apiHandler(async (req) => {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const userId = req.headers.get('x-user-id');
    const clinicId = req.headers.get('x-clinic-id');

    if (!clinicId) throw new Error("Clinic ID missing");

    const records = await prisma.medicalRecord.findMany({
        where: {
            clinicId,
            OR: [
                { patient: { firstName: { contains: search, mode: 'insensitive' } } },
                { patient: { lastName: { contains: search, mode: 'insensitive' } } },
                { patient: { documentNumber: { contains: search } } }
            ]
        },
        include: {
            patient: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    photoUrl: true
                }
            },
            doctor: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        },
        orderBy: { date: 'desc' },
        take: 50
    });

    const formatted = records.map(r => ({
        id: r.id,
        date: r.date,
        type: r.type, // CONSULTATION, LAB_RESULT
        patientName: `${r.patient.firstName} ${r.patient.lastName}`,
        doctorName: `Dr. ${r.doctor.firstName} ${r.doctor.lastName}`,
        summary: (r.content as any)?.subjective || 'No summary available',
        status: 'Finalized'
    }));

    return NextResponse.json(formatted);
});
