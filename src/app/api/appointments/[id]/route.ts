import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";

export const GET = apiHandler(async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // In a real app, verify user has access to this clinic/appointment

    const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
            patient: {
                include: {
                    medicalRecords: {
                        orderBy: { date: 'desc' },
                        take: 5
                    }
                }
            },
            doctor: true
        }
    });

    if (!appointment) {
        throw new Error("Appointment not found");
    }

    return NextResponse.json(appointment);
});
