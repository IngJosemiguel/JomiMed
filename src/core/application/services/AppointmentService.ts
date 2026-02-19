import { IAppointmentRepository } from "@/core/application/interfaces/appointments/IAppointmentRepository";
import { Appointment } from "@prisma/client";

export class AppointmentService {
    constructor(private appointmentRepo: IAppointmentRepository) { }

    async createAppointment(clinicId: string, data: any): Promise<Appointment> {
        const startDate = new Date(data.datetime);
        const duration = data.duration || 30;
        const endDate = new Date(startDate.getTime() + duration * 60000);

        // 1. Check for Doctor availability (simple overlap check)
        if (data.doctorId) {
            const doctorAppointments = await this.appointmentRepo.findByDoctorAndDateRange(
                clinicId,
                data.doctorId,
                startDate,
                endDate
            );

            const hasOverlap = doctorAppointments.some(appt => {
                const apptStart = new Date(appt.datetime);
                const apptEnd = new Date(apptStart.getTime() + appt.duration * 60000);
                return (startDate < apptEnd && endDate > apptStart);
            });

            if (hasOverlap) {
                throw new Error("Doctor is not available at this time.");
            }
        }

        return this.appointmentRepo.create({
            ...data,
            clinicId,
        });
    }

    async getAppointments(clinicId: string, start: string, end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return this.appointmentRepo.findByDateRange(clinicId, startDate, endDate);
    }

    async updateAppointment(id: string, clinicId: string, data: any) {
        const appointment = await this.appointmentRepo.findById(id);
        if (!appointment || appointment.clinicId !== clinicId) {
            throw new Error("Appointment not found");
        }
        return this.appointmentRepo.update(id, data);
    }

    async deleteAppointment(id: string, clinicId: string) {
        const appointment = await this.appointmentRepo.findById(id);
        if (!appointment || appointment.clinicId !== clinicId) {
            throw new Error("Appointment not found");
        }
        return this.appointmentRepo.delete(id);
    }
}
