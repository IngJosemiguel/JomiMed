import { NextResponse } from "next/server";
import { PrismaFinanceRepository } from "@/infrastructure/persistence/finance/PrismaFinanceRepository";
import { FinanceService } from "@/core/application/services/FinanceService";
import { z } from "zod";

const financeRepo = new PrismaFinanceRepository();
const financeService = new FinanceService(financeRepo);

const CreateInvoiceSchema = z.object({
    patientId: z.string().min(1),
    dueDate: z.string().datetime(),
    items: z.array(z.object({
        description: z.string(),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0)
    })).min(1)
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const invoices = await financeService.getInvoices(clinicId);
    return NextResponse.json(invoices);
}

export async function POST(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = CreateInvoiceSchema.parse(body);

        const invoice = await financeService.createInvoice(clinicId, data);
        return NextResponse.json(invoice);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
