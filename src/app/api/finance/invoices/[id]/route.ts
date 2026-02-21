import { NextResponse } from "next/server";
import { PrismaFinanceRepository } from "@/infrastructure/persistence/finance/PrismaFinanceRepository";
import { FinanceService } from "@/core/application/services/FinanceService";
import prisma from "@/lib/prisma";

const financeRepo = new PrismaFinanceRepository();
const financeService = new FinanceService(financeRepo);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            patient: true // items is JSON, auto-included
        }
    });

    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    return NextResponse.json(invoice);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const clinicId = request.headers.get("x-clinic-id");
        if (!clinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

        const { id } = await params;
        const body = await request.json();
        const { status, amount, method } = body;

        if (status === 'PAID' && !amount) {
            // Legacy fast update or confirm full payment
            const invoice = await prisma.invoice.findUnique({ where: { id } });
            if (invoice) {
                const balance = Number(invoice.totalAmount) - Number(invoice.paidAmount);
                if (balance > 0) {
                    await financeService.recordPayment(clinicId, id, balance, method || 'CASH');
                }
                return NextResponse.json({ success: true });
            }
        }

        if (amount) {
            const payment = await financeService.recordPayment(clinicId, id, Number(amount), method || 'CASH');
            return NextResponse.json(payment);
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
