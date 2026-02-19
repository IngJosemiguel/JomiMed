import { NextResponse } from "next/server";
import { ZodError, ZodSchema } from "zod";

type HandlerWithBody<T = any> = (body: T, req: Request) => Promise<Response>;
type HandlerWithoutBody = (req: Request, ...args: any[]) => Promise<Response>;

function isZodSchema(obj: any): obj is ZodSchema {
    return obj && typeof obj.parse === 'function';
}

export function apiHandler(
    schemaOrHandler: ZodSchema | HandlerWithoutBody,
    handlerWithBody?: HandlerWithBody
) {
    return async (req: Request, ...args: any[]) => {
        try {
            if (isZodSchema(schemaOrHandler)) {
                if (!handlerWithBody) {
                    throw new Error("Handler function is required when using ZodSchema");
                }
                // Validation Mode
                const body = await req.json();
                const parsed = schemaOrHandler.parse(body);
                return await handlerWithBody(parsed, req);
            } else if (typeof schemaOrHandler === 'function') {
                // Direct Handler Mode
                return await (schemaOrHandler as HandlerWithoutBody)(req, ...args);
            } else {
                throw new Error("Invalid apiHandler usage: First argument must be a Schema or Function");
            }
        } catch (err: any) {
            console.error("[API_ERROR]", err);

            if (err instanceof ZodError) {
                return NextResponse.json({ error: "Validation Failed", details: err.issues }, { status: 400 });
            }

            const msg = err.message || "";
            // 2. Known Domain Errors
            if (msg === "Invalid credentials" || msg === "User account is inactive") {
                return NextResponse.json({ error: msg }, { status: 401 });
            }

            if (msg.includes("Upgrade required") || msg.includes("Clinic is suspended")) {
                return NextResponse.json({ error: msg }, { status: 403 });
            }

            if (msg.includes("not found")) {
                return NextResponse.json({ error: msg }, { status: 404 });
            }

            if (msg.includes("already exists")) {
                return NextResponse.json({ error: msg }, { status: 409 });
            }

            // 3. Unexpected System Errors
            // DEBUG: Return actual error
            return NextResponse.json({ error: "Internal Server Error", details: msg, stack: err.stack }, { status: 500 });
        }
    };
}
