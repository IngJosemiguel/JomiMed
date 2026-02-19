import prisma from "@/lib/prisma";
import { IAppointmentRepository } from "@/core/application/interfaces/appointments/IAppointmentRepository";
import { Appointment } from "@prisma/client";

export class PrismaAppointmentRepository implements IAppointmentRepository {
    async create(data: any): Promise<Appointment> {
        return prisma.appointment.create({
            data,
            include: { patient: true, doctor: true }
        });
    }

    async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
        return prisma.appointment.update({
            where: { id },
            data,
            include: { patient: true, doctor: true }
        });
    }

    async findById(id: string): Promise<Appointment | null> {
        return prisma.appointment.findUnique({
            where: { id },
            include: { patient: true, doctor: true }
        });
    }

    async findByDateRange(clinicId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
        return prisma.appointment.findMany({
            where: {
                clinicId,
                datetime: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: { patient: true, doctor: true },
            orderBy: { datetime: 'asc' }
        });
    }

    async findByDoctorAndDateRange(clinicId: string, doctorId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
        return prisma.appointment.findMany({
            where: {
                clinicId,
                doctorId,
                datetime: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: { patient: true, doctor: true },
            orderBy: { datetime: 'asc' }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.appointment.delete({ where: { id } });
    }
}
