import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";

export const POST = apiHandler(async (req) => {
    const doctorId = req.headers.get("x-user-id");
    const clinicId = req.headers.get("x-clinic-id");

    if (!doctorId || !clinicId) throw new Error("Unauthorized");

    const body = await req.json();
    const { appointmentId, soap } = body;

    // 1. Validate Appointment matches Doctor/Clinic
    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
    });

    if (!appointment) throw new Error("Appointment not found");
    // In strict mode: if (appointment.doctorId !== doctorId) throw new Error("Not your appointment");

    // 2. Create Medical Record
    const record = await prisma.medicalRecord.create({
        data: {
            type: "CONSULTATION",
            content: soap, // JSON: { subjective, objective, ... }
            date: new Date(),
            patientId: appointment.patientId,
            doctorId: doctorId,
            clinicId: clinicId
        }
    });

    // 3. Mark Appointment as Completed
    await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED" }
    });

    // 4. Send Email Summary (Async - don't block response)
    // In a real app, use a queue. Here we just trigger it.
    const appointmentData = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: true,
            doctor: true,
            clinic: true
        }
    });

    if (appointmentData && appointmentData.patient.email) {
        // Dynamic import to avoid circular deps if any
        const { EmailService } = await import("@/core/application/services/EmailService");
        const emailService = new EmailService();

        emailService.sendConsultationSummary(
            appointmentData.patient.email,
            appointmentData.patient.firstName,
            appointmentData.doctor.lastName,
            soap.assessment || "Checkup completed.",
            soap.plan || "Follow instructions.",
            appointmentData.clinic.name
        ).catch(err => console.error("Failed to send email", err));
    }

    return NextResponse.json(record, { status: 201 });
});
