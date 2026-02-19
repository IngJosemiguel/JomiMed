import { Patient } from "@prisma/client";

export interface IPatientRepository {
    create(data: Partial<Patient>): Promise<Patient>;
    update(id: string, data: Partial<Patient>): Promise<Patient>;
    findById(id: string): Promise<Patient | null>;
    findAll(clinicId: string, options?: {
        skip?: number;
        take?: number;
        search?: string;
    }): Promise<{ patients: Patient[]; total: number }>;
    delete(id: string): Promise<void>;
    findByDocument(clinicId: string, documentNumber: string): Promise<Patient | null>;
}
