import { IFinanceRepository } from "@/core/application/interfaces/finance/IFinanceRepository";
import { Decimal } from "@prisma/client/runtime/library";

export class FinanceService {
    constructor(private financeRepo: IFinanceRepository) { }

    async createInvoice(clinicId: string, data: any) {
        const total = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);

        return this.financeRepo.createInvoice({
            ...data,
            clinicId,
            totalAmount: new Decimal(total),
            paidAmount: new Decimal(0),
            status: "PENDING",
            items: data.items // JSON field, pass directly
        });
    }

    async getInvoices(clinicId: string) {
        return this.financeRepo.getInvoices(clinicId);
    }

    async recordPayment(clinicId: string, invoiceId: string, amount: number, method: string) {
        const invoice = await this.financeRepo.getInvoiceById(invoiceId);
        if (!invoice || invoice.clinicId !== clinicId) throw new Error("Invoice not found");

        const payment = await this.financeRepo.createPayment({
            invoiceId,
            amount: new Decimal(amount),
            method: method || "CASH",
            date: new Date()
        });

        // Update Invoice Status
        const currentPaid = new Decimal(invoice.paidAmount || 0);
        const newPaidAmount = currentPaid.plus(amount);
        const newBalance = new Decimal(invoice.totalAmount).minus(newPaidAmount); // total - paid

        let newStatus = invoice.status;
        if (newBalance.lessThanOrEqualTo(0)) {
            newStatus = "PAID";
        } else if (newPaidAmount.greaterThan(0)) {
            newStatus = "PARTIAL"; // Or keep PENDING if you prefer
        }

        await this.financeRepo.updateInvoice(invoiceId, {
            paidAmount: newPaidAmount,
            status: newStatus
        });

        return payment;
    }
}
