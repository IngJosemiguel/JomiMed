import { IMedicalRecordRepository } from "@/core/application/interfaces/medical-records/IMedicalRecordRepository";
import { MedicalRecord } from "@prisma/client";

export class MedicalRecordService {
    constructor(private medicalRecordRepo: IMedicalRecordRepository) { }

    async createRecord(clinicId: string, doctorId: string, data: any): Promise<MedicalRecord> {
        // Here we could validate the 'content' against a FormTemplate if 'templateId' was provided
        // For now, we trust the Flexible JSON structure

        return this.medicalRecordRepo.create({
            ...data,
            clinicId,
            doctorId,
            date: new Date(),
        });
    }

    async getPatientHistory(clinicId: string, patientId: string) {
        return this.medicalRecordRepo.findByPatient(clinicId, patientId);
    }

    async getRecord(id: string, clinicId: string) {
        const record = await this.medicalRecordRepo.findById(id);
        if (!record || record.clinicId !== clinicId) {
            return null;
        }
        return record;
    }
}
