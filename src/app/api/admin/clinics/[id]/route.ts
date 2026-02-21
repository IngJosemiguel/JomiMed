import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";

// PUT: Update Clinic Status (Suspend/Activate)
export const PUT = apiHandler(async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const clinic = await prisma.clinic.update({
        where: { id },
        data: { status }
    });

    return NextResponse.json(clinic);
});

// DELETE: Remove Clinic (Wait... maybe soft delete?)
export const DELETE = apiHandler(async (req, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // For now, let's just mark as ARCHIVED instead of deleting data
    const clinic = await prisma.clinic.update({
        where: { id },
        data: { status: 'ARCHIVED' }
    });

    return NextResponse.json(clinic);
});
