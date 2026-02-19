import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
const ALG = "HS256";

export interface TokenPayload {
    userId: string;
    clinicId: string;
    roleId: string;
    role: string;
    email: string;
}

export class TokenService {
    static async sign(payload: TokenPayload): Promise<string> {
        return new SignJWT({ ...payload })
            .setProtectedHeader({ alg: ALG })
            .setIssuedAt()
            .setExpirationTime("24h") // Refresh token strategy implemented separately if needed
            .sign(SECRET);
    }

    static async verify(token: string): Promise<TokenPayload | null> {
        try {
            const { payload } = await jwtVerify(token, SECRET);
            return payload as unknown as TokenPayload;
        } catch (error) {
            console.error("JWT Verification failed:", error);
            return null;
        }
    }
}
