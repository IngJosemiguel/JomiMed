import prisma from "@/lib/prisma";
import { IFinanceRepository } from "@/core/application/interfaces/finance/IFinanceRepository";
import { Invoice, Payment } from "@prisma/client";

export class PrismaFinanceRepository implements IFinanceRepository {
    async createInvoice(data: any): Promise<Invoice> {
        return prisma.invoice.create({
            data,
            include: { patient: true } // items is JSON, not a relation
        });
    }

    async getInvoices(clinicId: string): Promise<Invoice[]> {
        return prisma.invoice.findMany({
            where: { clinicId },
            include: { patient: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async getInvoiceById(id: string): Promise<Invoice | null> {
        return prisma.invoice.findUnique({
            where: { id },
            include: { patient: true, payments: true }
        });
    }

    async createPayment(data: any): Promise<Payment> {
        return prisma.payment.create({ data });
    }

    async getPayments(clinicId: string): Promise<Payment[]> {
        return prisma.payment.findMany({
            where: {
                invoice: {
                    clinicId: clinicId
                }
            },
            include: { invoice: true },
            orderBy: { date: 'desc' }
        });
    }
    async updateInvoice(id: string, data: any): Promise<Invoice> {
        return prisma.invoice.update({
            where: { id },
            data
        });
    }
}
