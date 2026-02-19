import { NextResponse } from "next/server";
import { PrismaPatientRepository } from "@/infrastructure/persistence/patients/PrismaPatientRepository";
import { PrismaCustomFieldRepository } from "@/infrastructure/persistence/form-builder/PrismaCustomFieldRepository";
import { PatientService } from "@/core/application/services/PatientService";

const patientRepo = new PrismaPatientRepository();
const customFieldRepo = new PrismaCustomFieldRepository();
const patientService = new PatientService(patientRepo, customFieldRepo);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const { id } = await params;
    const patient = await patientService.getPatient(id, clinicId);

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    return NextResponse.json(patient);
}
