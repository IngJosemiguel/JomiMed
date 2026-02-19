import { Invoice, Payment } from "@prisma/client";

export interface IFinanceRepository {
    createInvoice(data: Partial<Invoice>): Promise<Invoice>;
    getInvoices(clinicId: string): Promise<Invoice[]>;
    getInvoiceById(id: string): Promise<Invoice | null>;
    createPayment(data: Partial<Payment>): Promise<Payment>;
    getPayments(clinicId: string): Promise<Payment[]>;
    updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice>;
}
