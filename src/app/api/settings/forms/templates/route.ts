import { NextResponse } from "next/server";
import { PrismaFormTemplateRepository } from "@/infrastructure/persistence/form-builder/PrismaFormTemplateRepository";
import { z } from "zod";

const repository = new PrismaFormTemplateRepository();

const CreateTemplateSchema = z.object({
    name: z.string(),
    type: z.enum(["HISTORY", "PRESCRIPTION", "CONSENT"]),
    content: z.record(z.any()), // Flexible JSON content for the form builder
    isDefault: z.boolean().default(false),
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const templates = await repository.findAllByClinic(clinicId);
    return NextResponse.json(templates);
}

export async function POST(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = CreateTemplateSchema.parse(body);

        const template = await repository.create({
            ...data,
            clinicId,
        });

        return NextResponse.json(template);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
