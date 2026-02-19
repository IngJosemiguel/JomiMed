import { NextResponse } from "next/server";
import { PrismaAppointmentRepository } from "@/infrastructure/persistence/appointments/PrismaAppointmentRepository";
import { AppointmentService } from "@/core/application/services/AppointmentService";
import { z } from "zod";

const appointmentRepo = new PrismaAppointmentRepository();
const appointmentService = new AppointmentService(appointmentRepo);

const CreateAppointmentSchema = z.object({
    patientId: z.string().min(1),
    doctorId: z.string().min(1),
    datetime: z.string().datetime(),
    duration: z.number().min(5).default(30),
    reason: z.string().optional(),
    notes: z.string().optional(),
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const status = searchParams.get("status");

    let appointments;
    if (start && end) {
        appointments = await appointmentService.getAppointments(clinicId, start, end);
    } else {
        // Fallback: Default to +/- 1 year if dates are missing
        const defaultStart = new Date();
        defaultStart.setFullYear(defaultStart.getFullYear() - 1);
        const defaultEnd = new Date();
        defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);

        appointments = await appointmentService.getAppointments(
            clinicId,
            start || defaultStart.toISOString(),
            end || defaultEnd.toISOString()
        );
    }

    if (status) {
        appointments = appointments.filter((a: any) => a.status === status);
    }

    return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = CreateAppointmentSchema.parse(body);

        const appointment = await appointmentService.createAppointment(clinicId, data);
        return NextResponse.json(appointment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
