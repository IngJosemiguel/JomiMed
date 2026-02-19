import { MedicalRecord } from "@prisma/client";

export interface IMedicalRecordRepository {
    create(data: Partial<MedicalRecord>): Promise<MedicalRecord>;
    update(id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord>;
    findById(id: string): Promise<MedicalRecord | null>;
    findByPatient(clinicId: string, patientId: string): Promise<MedicalRecord[]>;
    delete(id: string): Promise<void>;
}
