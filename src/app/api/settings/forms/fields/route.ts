import { NextResponse } from "next/server";
import { PrismaCustomFieldRepository } from "@/infrastructure/persistence/form-builder/PrismaCustomFieldRepository";
import { z } from "zod";

const repository = new PrismaCustomFieldRepository();

const CreateFieldSchema = z.object({
    name: z.string(),
    label: z.string(),
    type: z.enum(["TEXT", "NUMBER", "DATE", "SELECT", "CHECKBOX", "TEXTAREA"]),
    entityType: z.enum(["PATIENT", "APPOINTMENT", "CONSULTATION"]),
    options: z.array(z.string()).optional(),
    isRequired: z.boolean().default(false),
    order: z.number().default(0),
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get("entityType");

    if (entityType) {
        const fields = await repository.findByEntity(clinicId, entityType);
        return NextResponse.json(fields);
    }

    const fields = await repository.findAllByClinic(clinicId);
    return NextResponse.json(fields);
}

export async function POST(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = CreateFieldSchema.parse(body);

        const field = await repository.create({
            ...data,
            clinicId,
        });

        return NextResponse.json(field);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
