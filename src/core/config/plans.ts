export const PLANS = {
    FREE: {
        maxUsers: 1,
        maxPatients: 50,
        maxStorage: 500 * 1024 * 1024, // 500MB
        features: ['PATIENTS', 'APPOINTMENTS', 'BASIC_EMR'],
    },
    PRO: {
        maxUsers: 5,
        maxPatients: 2000,
        maxStorage: 10 * 1024 * 1024 * 1024, // 10GB
        features: ['PATIENTS', 'APPOINTMENTS', 'ADVANCED_EMR', 'PDF_RX', 'FINANCE'],
    },
    ENTERPRISE: {
        maxUsers: 9999,
        maxPatients: 999999,
        maxStorage: 1024 * 1024 * 1024 * 1024, // 1TB
        features: ['ALL', 'API_ACCESS', 'SSO'],
    },
};

export type PlanType = keyof typeof PLANS;
