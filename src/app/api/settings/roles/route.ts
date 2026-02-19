import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const CreateRoleSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    permissions: z.array(z.string()), // Array of permission strings
});

export async function GET(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    const roles = await prisma.role.findMany({
        where: { clinicId },
        include: { _count: { select: { users: true } } }
    });

    return NextResponse.json(roles);
}

export async function POST(request: Request) {
    const clinicId = request.headers.get("x-clinic-id");
    if (!clinicId) return NextResponse.json({ error: "Clinic ID mismatch" }, { status: 403 });

    try {
        const body = await request.json();
        const data = CreateRoleSchema.parse(body);

        const role = await prisma.role.create({
            data: {
                ...data,
                clinicId,
                permissions: JSON.stringify(data.permissions), // Serialize for Prisma
            },
        });

        return NextResponse.json(role);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
