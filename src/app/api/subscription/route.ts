import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { SubscriptionService } from "@/core/application/services/SubscriptionService";

export const GET = apiHandler(async (req) => {
    const clinicId = req.headers.get("x-clinic-id");
    if (!clinicId) throw new Error("Clinic ID missing");

    const stats = await SubscriptionService.getUsageStats(clinicId);

    // Simulate invoices for demo
    const invoices = [
        { id: 'INV-001', date: new Date(), amount: 0, status: 'PAID', description: 'Free Tier - Monthly' },
        { id: 'INV-000', date: new Date(Date.now() - 2592000000), amount: 0, status: 'PAID', description: 'Free Tier - Monthly' }
    ];

    return NextResponse.json({ ...stats, invoices });
});
