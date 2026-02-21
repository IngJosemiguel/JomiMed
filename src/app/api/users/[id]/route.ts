import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await prisma.user.findUnique({
            where: { id: id },
            include: {
                clinic: true,
                role: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Remove sensitive data
        const { passwordHash, ...safeUser } = user;

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Destructure allowed fields to prevent arbitrary updates (e.g., roleId, clinicId)
        const {
            firstName,
            lastName,
            phone,
            specialization,
            medicalLicense,
            password
        } = body;

        const updateData: any = {
            firstName,
            lastName,
            phone,
            specialization,
            medicalLicense
        };

        if (password) {
            updateData.passwordHash = await hash(password, 10);
        }

        // Clean up undefined fields
        Object.keys(updateData).forEach(
            key => updateData[key] === undefined && delete updateData[key]
        );

        const updatedUser = await prisma.user.update({
            where: { id: id },
            data: updateData,
        });

        const { passwordHash, ...safeUser } = updatedUser;

        return NextResponse.json(safeUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
