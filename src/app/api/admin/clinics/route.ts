import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import prisma from "@/lib/prisma";
import { PasswordService } from "@/infrastructure/security/password.service";

// POST: Create a new Clinic + Admin User
export const POST = apiHandler(async (req) => {
    const body = await req.json();
    const { name, email, password, plan, subdomain } = body;

    // Transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
        // 1. Create Clinic
        const clinic = await tx.clinic.create({
            data: {
                name,
                slug: subdomain || name.toLowerCase().replace(/\s+/g, '-'),
                status: 'ACTIVE',
                // @ts-ignore: Prisma generated types might be stale
                subscription: {
                    create: {
                        plan: plan || 'FREE',
                        status: 'ACTIVE'
                    }
                }
            }
        });

        // 2. Create System Role for this Clinic
        const adminRole = await tx.role.create({
            data: {
                name: 'ADMIN',
                description: 'Clinic Administrator',
                isSystem: true,
                permissions: ["*"], // Full permissions
                clinicId: clinic.id
            }
        });

        // 3. Create Admin User
        const hashedPassword = await PasswordService.hash(password);
        const user = await tx.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                firstName: 'Admin',
                lastName: 'User',
                clinicId: clinic.id,
                roleId: adminRole.id
            }
        });

        return { clinic, user };
    });

    return NextResponse.json(result, { status: 201 });
});

// GET: List all clinics (Super Admin only)
export const GET = apiHandler(async (req) => {
    // In a real scenario, check for SUPER_ADMIN permission here

    // Fetch clinics with subscription and user count
    // @ts-ignore: Include types might be stale
    const clinics = await prisma.clinic.findMany({
        include: {
            subscription: true,
            _count: {
                select: { users: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Format for UI
    const formatted = (clinics as any[]).map(c => ({
        id: c.id,
        name: c.name,
        plan: c.subscription?.plan || 'FREE',
        users: c._count?.users || 0,
        revenue: '$0', // TODO: Calculate from invoices
        status: c.status,
        lastAudit: 'N/A' // TODO: Get latest audit log
    }));

    return NextResponse.json(formatted);
});
