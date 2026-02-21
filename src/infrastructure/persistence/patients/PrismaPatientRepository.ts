import prisma from "@/lib/prisma";
import { IPatientRepository } from "@/core/application/interfaces/patients/IPatientRepository";
import { Patient, Prisma } from "@prisma/client";

export class PrismaPatientRepository implements IPatientRepository {
    async create(data: any): Promise<Patient> {
        return prisma.patient.create({ data });
    }

    async update(id: string, data: Partial<Patient>): Promise<Patient> {
        return prisma.patient.update({
            where: { id },
            data: data as any,
        });
    }

    async findById(id: string): Promise<Patient | null> {
        return prisma.patient.findUnique({
            where: { id },
        });
    }

    async findByDocument(clinicId: string, documentNumber: string): Promise<Patient | null> {
        return prisma.patient.findUnique({
            where: {
                clinicId_documentNumber: {
                    clinicId,
                    documentNumber
                }
            }
        });
    }

    async findAll(clinicId: string, options?: { skip?: number; take?: number; search?: string }) {
        const { skip = 0, take = 10, search } = options || {};

        const where: Prisma.PatientWhereInput = {
            clinicId,
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { documentNumber: { contains: search } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const [patients, total] = await prisma.$transaction([
            prisma.patient.findMany({
                where,
                skip,
                take,
                orderBy: { updatedAt: 'desc' },
            }),
            prisma.patient.count({ where }),
        ]);

        return { patients, total };
    }

    async delete(id: string): Promise<void> {
        await prisma.patient.delete({ where: { id } });
    }
}
