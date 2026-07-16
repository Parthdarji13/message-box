import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    if (
        token &&
        (url.pathname.startsWith("/sign-in") ||
            url.pathname.startsWith("/sign-up") ||
            url.pathname.startsWith("/verify") ||
            url.pathname === "/")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!token && url.pathname.startsWith("/dashboard")) {
        const response = NextResponse.redirect(new URL("/sign-in", request.url));
        // ← add these headers to prevent caching
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        response.headers.set('Pragma', 'no-cache');
        return response;
    }

    const response = NextResponse.next();
    // ← prevent browser from caching protected pages
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
}

export const config = {
    matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};