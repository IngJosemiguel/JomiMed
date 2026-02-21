import { NextResponse } from "next/server";
import { PrismaPatientRepository } from "@/infrastructure/persistence/patients/PrismaPatientRepository";
import { PrismaCustomFieldRepository } from "@/infrastructure/persistence/form-builder/PrismaCustomFieldRepository";
import { PatientService } from "@/core/application/services/PatientService";
import { z } from "zod";

const patientRepo = new PrismaPatientRepository();
const customFieldRepo = new PrismaCustomFieldRepository();
const patientService = new PatientService(patientRepo, customFieldRepo);

const CreatePatientSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    dateOfBirth: z.string().transform((str) => new Date(str)),
    documentNumber: z.string().min(1),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    customData: z.record(z.string(), z.any()).optional(),
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || undefined;

    const result = await patientService.getPatients(clinicId, { page, limit, search });
    return NextResponse.json(result);
}

export async function POST(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = CreatePatientSchema.parse(body);

        const patient = await patientService.createPatient(clinicId, data);
        return NextResponse.json(patient);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
