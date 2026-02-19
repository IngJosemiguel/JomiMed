import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const UpdateSettingsSchema = z.object({
    name: z.string().optional(),
    primaryColor: z.string().regex(/^#/, "Invalid color").optional(),
    timezone: z.string().optional(),
    currency: z.string().optional(),
    settings: z.record(z.any()).optional(), // JSON config for hours, etc.
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const clinic = await prisma.clinic.findUnique({
        where: { id: clinicId },
        select: {
            name: true,
            logoUrl: true,
            primaryColor: true,
            timezone: true,
            currency: true,
            settings: true,
        }
    });

    return NextResponse.json(clinic);
}

export async function PATCH(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = UpdateSettingsSchema.parse(body);

        const clinic = await prisma.clinic.update({
            where: { id: clinicId },
            data: {
                ...data,
                // If settings JSON is provided, we merge (logic depends on needs, here strict replace or deep merge?)
                // Prisma JSON replace is default.
            },
        });

        return NextResponse.json(clinic);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
