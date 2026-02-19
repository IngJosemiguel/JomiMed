import prisma from "@/lib/prisma";
import { IMedicalRecordRepository } from "@/core/application/interfaces/medical-records/IMedicalRecordRepository";
import { MedicalRecord } from "@prisma/client";

export class PrismaMedicalRecordRepository implements IMedicalRecordRepository {
    async create(data: any): Promise<MedicalRecord> {
        return prisma.medicalRecord.create({
            data,
            include: { doctor: true }
        });
    }

    async update(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> {
        return prisma.medicalRecord.update({
            where: { id },
            data,
            include: { doctor: true }
        });
    }

    async findById(id: string): Promise<MedicalRecord | null> {
        return prisma.medicalRecord.findUnique({
            where: { id },
            include: { doctor: true, patient: true }
        });
    }

    async findByPatient(clinicId: string, patientId: string): Promise<MedicalRecord[]> {
        return prisma.medicalRecord.findMany({
            where: { clinicId, patientId },
            include: { doctor: true },
            orderBy: { date: 'desc' }
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.medicalRecord.delete({ where: { id } });
    }
}
