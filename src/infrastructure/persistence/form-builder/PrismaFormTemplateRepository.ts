import prisma from "@/lib/prisma";
import { IFormTemplateRepository } from "@/core/application/interfaces/form-builder/IFormTemplateRepository";
import { FormTemplate } from "@prisma/client";

export class PrismaFormTemplateRepository implements IFormTemplateRepository {
    async create(data: any): Promise<FormTemplate> {
        return prisma.formTemplate.create({ data });
    }

    async findAllByClinic(clinicId: string): Promise<FormTemplate[]> {
        return prisma.formTemplate.findMany({
            where: { clinicId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findById(id: string): Promise<FormTemplate | null> {
        return prisma.formTemplate.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: Partial<FormTemplate>): Promise<FormTemplate> {
        return prisma.formTemplate.update({
            where: { id },
            data: data as any,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.formTemplate.delete({ where: { id } });
    }
}
