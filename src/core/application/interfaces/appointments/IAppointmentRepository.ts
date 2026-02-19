import { Appointment } from "@prisma/client";

export interface IAppointmentRepository {
    create(data: Partial<Appointment>): Promise<Appointment>;
    update(id: string, data: Partial<Appointment>): Promise<Appointment>;
    findById(id: string): Promise<Appointment | null>;
    findByDateRange(clinicId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
    findByDoctorAndDateRange(clinicId: string, doctorId: string, startDate: Date, endDate: Date): Promise<Appointment[]>;
    delete(id: string): Promise<void>;
}
