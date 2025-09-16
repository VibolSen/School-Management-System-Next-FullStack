import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const isAuthPath = path === "/login" || path === "/register";

  const token = request.cookies.get("token")?.value;

  // If there's no token and the user is trying to access a protected route
  if (!token && !isAuthPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If there is a token, verify it
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const userRole = payload.role?.toLowerCase();

      // If user is authenticated, they should not access login/register pages
      if (isAuthPath) {
        return NextResponse.redirect(
          new URL(`/${userRole}/dashboard`, request.url)
        );
      }

      // Define role-based access rules
      const roleAccess = {
        admin: "/admin",
        hr: "/hr",
        faculty: "/faculty",
        teacher: "/teacher",
        student: "/student",
      };

      const requiredBasePath = roleAccess[userRole];

      // If the user's role does not match the path, redirect them
      if (requiredBasePath && !path.startsWith(requiredBasePath)) {
        // Redirect to their own dashboard
        return NextResponse.redirect(
          new URL(`${requiredBasePath}/dashboard`, request.url)
        );
      }
    } catch (err) {
      // If token verification fails, clear the cookie and redirect to login
      console.error("Token verification failed:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.set("token", "", { expires: new Date(0) });
      return response;
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all routes except for static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
