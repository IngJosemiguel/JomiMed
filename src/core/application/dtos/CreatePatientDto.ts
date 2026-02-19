export interface CreatePatientDto {
    firstName: string;
    lastName: string;
    dateOfBirth: Date | string;
    documentNumber: string;
    email?: string;
    phone?: string;
    address?: string;
    customData?: Record<string, any>;
}
