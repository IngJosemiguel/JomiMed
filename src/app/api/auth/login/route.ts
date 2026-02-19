import { apiHandler } from "@/lib/api-handler";
import { AuthRepository } from "@/infrastructure/persistence/AuthRepository";
import { LoginUseCase } from "@/core/application/use-cases/LoginUseCase";
import { LoginSchema } from "@/core/application/dtos/LoginDto";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 default: admin@demo.com
 *               password:
 *                 type: string
 *                 default: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
export const POST = apiHandler(LoginSchema, async (body) => {
    const authRepository = new AuthRepository();
    const loginUseCase = new LoginUseCase(authRepository);

    const result = await loginUseCase.execute(body);

    const response = NextResponse.json(result);

    // Set cookie for middleware access in frontend
    response.cookies.set("token", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 86400, // 1 day
        path: "/",
    });

    return response;
});
