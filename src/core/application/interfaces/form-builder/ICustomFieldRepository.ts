import { CustomField } from "@prisma/client";

export interface ICustomFieldRepository {
    create(data: Partial<CustomField>): Promise<CustomField>;
    findAllByClinic(clinicId: string): Promise<CustomField[]>;
    findByEntity(clinicId: string, entityType: string): Promise<CustomField[]>;
    update(id: string, data: Partial<CustomField>): Promise<CustomField>;
    delete(id: string): Promise<void>;
}
