export const PERMISSIONS = {
    // Patients
    PATIENT_READ: "patient:read",
    PATIENT_CREATE: "patient:create",
    PATIENT_UPDATE: "patient:update",
    PATIENT_DELETE: "patient:delete",

    // Appointments
    APPOINTMENT_READ: "appointment:read",
    APPOINTMENT_CREATE: "appointment:create",
    APPOINTMENT_UPDATE: "appointment:update",
    APPOINTMENT_DELETE: "appointment:delete",

    // EMR
    EMR_READ: "emr:read",
    EMR_CREATE: "emr:create",
    EMR_SIGN: "emr:sign",

    // Settings & Admin
    SETTINGS_MANAGE: "settings:manage",
    ROLES_MANAGE: "roles:manage",
    USERS_MANAGE: "users:manage",
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export class PermissionService {
    static getAllPermissions() {
        return Object.values(PERMISSIONS);
    }

    static validatePermissions(userPermissions: string[], requiredPermissions: Permission[]) {
        // SuperAdmin bypass (assuming '*' wildcard in DB)
        if (userPermissions.includes('*')) return true;

        return requiredPermissions.every(p => userPermissions.includes(p));
    }
}
