import prisma from "@/lib/prisma";
import { PLANS, PlanType } from "@/core/config/plans";

export class SubscriptionService {

    static async getSubscription(clinicId: string) {
        return prisma.subscription.findUnique({
            where: { clinicId }
        });
    }

    static async checkLimit(clinicId: string, resource: 'users' | 'patients' | 'storage', currentCountOrSize: number = 0) {
        let sub = await this.getSubscription(clinicId);

        // Self-healing: Create FREE subscription if missing
        if (!sub) {
            sub = await prisma.subscription.create({
                data: {
                    clinicId,
                    plan: 'FREE',
                    status: 'ACTIVE',
                    startDate: new Date(),
                    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10))
                }
            });
        }

        if (sub.status !== 'ACTIVE') {
            throw new Error("Subscription is suspended.");
        }

        const planConfig = PLANS[sub.plan as PlanType] || PLANS.FREE;

        let limit = 0;
        let used = 0;

        switch (resource) {
            case 'users':
                limit = planConfig.maxUsers;
                // Optimization: In real app, store 'used' in DB and increment. Here we might count.
                used = await prisma.user.count({ where: { clinicId } });
                break;
            case 'patients':
                limit = planConfig.maxPatients;
                used = await prisma.patient.count({ where: { clinicId } });
                break;
            case 'storage':
                limit = planConfig.maxStorage;
                used = sub.storageUsed + currentCountOrSize;
                break;
        }

        if (used >= limit) {
            throw new Error(`Upgrade required: ${resource} limit reached (${used}/${limit}).`);
        }

        return true;
    }

    static async hasFeature(clinicId: string, featureCode: string) {
        const sub = await this.getSubscription(clinicId);
        if (!sub) return false;

        const planConfig = PLANS[sub.plan as PlanType] || PLANS.FREE;

        if (planConfig.features.includes('ALL')) return true;
        return planConfig.features.includes(featureCode);
    }

    static async getUsageStats(clinicId: string) {
        const sub = await this.getSubscription(clinicId);
        if (!sub) return null;

        const planConfig = PLANS[sub.plan as PlanType] || PLANS.FREE;

        // Count actual usage
        const patientsUsed = await prisma.patient.count({ where: { clinicId } });
        const usersUsed = await prisma.user.count({ where: { clinicId } });

        // Mock storage calculation (in real app, sum file sizes)
        const storageUsed = sub.storageUsed || 0;

        return {
            plan: sub.plan,
            status: sub.status,
            periodStart: sub.startDate,
            periodEnd: sub.endDate,
            limits: {
                patients: { used: patientsUsed, max: planConfig.maxPatients },
                users: { used: usersUsed, max: planConfig.maxUsers },
                storage: { used: storageUsed, max: planConfig.maxStorage }
            }
        };
    }
}
