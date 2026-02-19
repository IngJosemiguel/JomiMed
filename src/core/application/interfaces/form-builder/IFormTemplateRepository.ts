import { FormTemplate } from "@prisma/client";

export interface IFormTemplateRepository {
    create(data: Partial<FormTemplate>): Promise<FormTemplate>;
    findAllByClinic(clinicId: string): Promise<FormTemplate[]>;
    findById(id: string): Promise<FormTemplate | null>;
    update(id: string, data: Partial<FormTemplate>): Promise<FormTemplate>;
    delete(id: string): Promise<void>;
}
