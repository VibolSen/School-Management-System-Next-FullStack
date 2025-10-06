import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long" // Ensure this secret is consistent with /api/login/route.js and /api/profile/update/route.js
);

// Define all the valid paths for each role
const roleProtectedPaths = {
  admin: ["/admin"],
  hr: ["/hr"],
  faculty: ["/faculty"],
  teacher: ["/teacher"],
  student: ["/student"],
};

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/" || path === "/login" || path === "/register" || path === "/about" || path === "/contact";
  const token = request.cookies.get("token")?.value;

  // 1. If no token and trying to access a protected route, redirect to login
  if (!token && !isAuthPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If there is a token, verify it
  if (token) {
    let payload;
    try {
      ({ payload } = await jwtVerify(token, JWT_SECRET));
    } catch (err) {
      // If token is invalid, clear it and redirect to login
      console.error("Token verification failed:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("token", "", { expires: new Date(0) });
      return response;
    }

    const userRole = payload.role?.toLowerCase();

    // 3. If authenticated user tries to access login/register, redirect to their dashboard
    if (isAuthPath) {
      const dashboardUrl = `/${userRole}/dashboard`;
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }

    // Protect API routes
    if (path.startsWith('/api/library')) {
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
        if (userRole !== 'admin' && userRole !== 'faculty') {
          return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    }
    // ✅ IMPROVED LOGIC: Check if the user is in an area they are allowed to be in
    const allowedPaths = roleProtectedPaths[userRole];
    const isAccessingAllowedPath =
      allowedPaths && allowedPaths.some((p) => path.startsWith(p));

    // 4. If the user is trying to access a path that doesn't belong to their role, redirect them
    if (!isAccessingAllowedPath) {
      const dashboardUrl = `/${userRole}/dashboard`;
      console.warn(
        `Redirecting user with role '${userRole}' from '${path}' to '${dashboardUrl}'`
      );
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }

  // 5. If all checks pass, allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // This matcher remains the same
    "/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|svg)|favicon.ico).*)",
  ],
};
