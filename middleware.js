import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long" // Ensure this secret is consistent with /api/login/route.js and /api/profile/update/route.js
);

// Define all the valid paths for each role
const roleProtectedPaths = {
  admin: ["/admin", "/admin/dashboard"],
  hr: ["/hr", "/hr/dashboard"],
  teacher: ["/teacher", "/teacher/dashboard", "/teacher/assignments"],
  student: ["/student", "/student/dashboard", "/student/invoices", "/student/invoices/[id]"],
  study_office: ["/study-office", "/study-office/dashboard", "/study-office/students", "/study-office/courses", "/study-office/courses/[id]", "/study-office/assignments", "/study-office/exams"],
};

export async function middleware(request) {
  let path = request.nextUrl.pathname;
  // Normalize path: remove trailing slash unless it's the root
  if (path.length > 1 && path.endsWith('/')) {
    path = path.slice(0, -1);
  }
  // Decode URI components to handle encoded characters
  path = decodeURIComponent(path);
  const isAuthPath = path === "/" || path === "/login" || path === "/register" || path === "/about" || path === "/contact" || path === "/careers" || path.startsWith("/careers/") || path.startsWith("/faculties") || path.startsWith("/courses");
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
    const dashboardPath = `/${userRole}/dashboard`;

    // 3. If authenticated user tries to access login/register, redirect to their dashboard
    if (isAuthPath) {
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    // Specific check for dashboard access to prevent redirect loops
    if (path === dashboardPath || path.startsWith(`${dashboardPath}/`)) {
      return NextResponse.next();
    }

    // Protect API routes
    if (path.startsWith('/api/library')) {
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
        if (userRole !== 'admin') {
          return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    if (path.startsWith('/api/student')) {
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
        if (userRole !== 'admin' && userRole !== 'study_office') {
          return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    if (path.startsWith('/api/departments')) {
      if (request.method === 'DELETE') {
        if (userRole !== 'admin' && userRole !== 'study_office') {
          return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    // Protect API routes for certificates
    if (path.startsWith('/api/certificates')) {
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
        if (userRole !== 'admin') {
          return new NextResponse(JSON.stringify({ error: 'Forbidden: Only administrators can manage certificates' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
      }
    }

    // ✅ IMPROVED LOGIC: Check if the user is in an area they are allowed to be in
    const allowedPaths = roleProtectedPaths[userRole];
    const isAccessingAllowedPath =
      allowedPaths &&
      allowedPaths.some((p) => {
        if (path === p) return true;
        if (path.startsWith(`${p}/`)) return true;
        return false;
      });

    // 4. If the user is trying to access a path that doesn't belong to their role, redirect them
    if (!isAccessingAllowedPath) {
      console.warn(
        `Redirecting user with role '${userRole}' from '${path}' to '${dashboardPath}'`
      );
      return NextResponse.redirect(new URL(dashboardPath, request.url));
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
