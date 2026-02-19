import { IPatientRepository } from "@/core/application/interfaces/patients/IPatientRepository";
import { ICustomFieldRepository } from "@/core/application/interfaces/form-builder/ICustomFieldRepository";
import { Patient } from "@prisma/client";

import { SubscriptionService } from "@/core/application/services/SubscriptionService";
import { CreatePatientDto } from "@/core/application/dtos/CreatePatientDto";

export class PatientService {
    constructor(
        private patientRepo: IPatientRepository,
        private customFieldRepo: ICustomFieldRepository
    ) { }

    async createPatient(clinicId: string, data: CreatePatientDto): Promise<Patient> {
        // 0. Check SaaS Limits
        await SubscriptionService.checkLimit(clinicId, 'patients');

        // 1. Check for duplicates
        const existing = await this.patientRepo.findByDocument(clinicId, data.documentNumber);
        if (existing) {
            throw new Error(`Patient with document ${data.documentNumber} already exists.`);
        }

        // 2. Validate Custom Fields
        if (data.customData) {
            // In a real scenario, we would validate types and required fields here
            // const fields = await this.customFieldRepo.findByEntity(clinicId, "PATIENT");
            // validateCustomData(data.customData, fields);
        }

        // 3. Create
        return this.patientRepo.create({
            ...data,
            dateOfBirth: new Date(data.dateOfBirth), // Ensure Date object
            clinicId,
        });
    }

    async updatePatient(id: string, clinicId: string, data: any): Promise<Patient> {
        const patient = await this.patientRepo.findById(id);
        if (!patient || patient.clinicId !== clinicId) {
            throw new Error("Patient not found");
        }

        return this.patientRepo.update(id, data);
    }

    async getPatients(clinicId: string, params: { page: number; limit: number; search?: string }) {
        const skip = (params.page - 1) * params.limit;
        return this.patientRepo.findAll(clinicId, {
            skip,
            take: params.limit,
            search: params.search,
        });
    }

    async getPatient(id: string, clinicId: string) {
        const patient = await this.patientRepo.findById(id);
        if (!patient || patient.clinicId !== clinicId) {
            return null;
        }
        return patient;
    }
}
