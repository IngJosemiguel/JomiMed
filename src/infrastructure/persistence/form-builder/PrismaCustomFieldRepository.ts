import prisma from "@/lib/prisma";
import { ICustomFieldRepository } from "@/core/application/interfaces/form-builder/ICustomFieldRepository";
import { CustomField } from "@prisma/client";

export class PrismaCustomFieldRepository implements ICustomFieldRepository {
    async create(data: any): Promise<CustomField> {
        return prisma.customField.create({ data });
    }

    async findAllByClinic(clinicId: string): Promise<CustomField[]> {
        return prisma.customField.findMany({
            where: { clinicId },
            orderBy: { order: 'asc' }
        });
    }

    async findByEntity(clinicId: string, entityType: string): Promise<CustomField[]> {
        return prisma.customField.findMany({
            where: { clinicId, entityType },
            orderBy: { order: 'asc' }
        });
    }

    async update(id: string, data: Partial<CustomField>): Promise<CustomField> {
        return prisma.customField.update({
            where: { id },
            data: data as any,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.customField.delete({ where: { id } });
    }
}
