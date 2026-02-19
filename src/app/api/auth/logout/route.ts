import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const response = NextResponse.redirect(new URL("/login", request.url));

    // Clear the token cookie by setting maxAge to 0
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 0
    });

    return response;
}
