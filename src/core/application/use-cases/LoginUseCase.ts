import { LoginDto } from "@/core/application/dtos/LoginDto";
import { IAuthRepository } from "@/core/application/interfaces/IAuthRepository";
import { PasswordService } from "@/infrastructure/security/password.service";
import { TokenService } from "@/infrastructure/security/token.service";

export class LoginUseCase {
    constructor(private authRepository: IAuthRepository) { }

    async execute(dto: LoginDto) {
        const user = await this.authRepository.findByEmail(dto.email);

        if (!user) {
            throw new Error("Invalid credentials");
        }

        if (!user.isActive) {
            throw new Error("User account is inactive");
        }

        if (user.clinic.status !== "ACTIVE") {
            throw new Error("Clinic is suspended");
        }

        const isValidPassword = await PasswordService.compare(dto.password, user.passwordHash);
        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        // Generate Token
        const token = await TokenService.sign({
            userId: user.id,
            clinicId: user.clinicId,
            roleId: user.roleId,
            role: user.role.name,
            email: user.email,
        });

        // Update last login (fire and forget)
        // await this.authRepository.updateLastLogin(user.id); 

        return {
            accessToken: token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                clinic: {
                    id: user.clinic.id,
                    name: user.clinic.name,
                    slug: user.clinic.slug,
                    logoUrl: user.clinic.logoUrl,
                    primaryColor: user.clinic.primaryColor,
                },
                role: user.role.name,
            },
        };
    }
}
