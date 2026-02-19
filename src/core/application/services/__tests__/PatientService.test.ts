import { PatientService } from "../PatientService";
import { CreatePatientDto } from "../../dtos/CreatePatientDto";
import { SubscriptionService } from "../../services/SubscriptionService";

// Mock Repositories
const mockPatientRepo = {
    create: jest.fn(),
    findByDocument: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
};

const mockCustomFieldRepo = {
    findByEntity: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
};

// Mock SubscriptionService
jest.mock("../../services/SubscriptionService");

describe("PatientService", () => {
    let service: PatientService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new PatientService(mockPatientRepo as any, mockCustomFieldRepo as any);
    });

    it("should create a patient successfully if limits allow", async () => {
        const dto: CreatePatientDto = {
            firstName: "John",
            lastName: "Doe",
            documentNumber: "12345678",
            dateOfBirth: "1990-01-01"
        };

        (SubscriptionService.checkLimit as jest.Mock).mockResolvedValue(true);
        (mockPatientRepo.findByDocument as jest.Mock).mockResolvedValue(null);
        (mockPatientRepo.create as jest.Mock).mockResolvedValue({ id: "1", ...dto });

        const result = await service.createPatient("clinic-1", dto);

        expect(SubscriptionService.checkLimit).toHaveBeenCalledWith("clinic-1", "patients");
        expect(mockPatientRepo.create).toHaveBeenCalled();
        expect(result.firstName).toBe("John");
    });

    it("should throw error if patient limit reached", async () => {
        const dto: CreatePatientDto = { firstName: "John", lastName: "Doe", documentNumber: "123", dateOfBirth: "1990-01-01" };

        (SubscriptionService.checkLimit as jest.Mock).mockRejectedValue(new Error("Limit reached"));

        await expect(service.createPatient("clinic-1", dto)).rejects.toThrow("Limit reached");
        expect(mockPatientRepo.create).not.toHaveBeenCalled();
    });
});
