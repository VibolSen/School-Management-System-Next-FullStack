import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

export async function GET(req) {
  try {
    // ✅ MODIFIED: We get the token from the cookies, which is more secure (HttpOnly)
    // and consistent with the middleware.
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    let decoded;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload;
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    // ✅ MODIFIED: Removed `include: { role: true }` as role is now a direct field.
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        department: true,
        ledCourses: {
          include: {
            department: true,
            groups: {
              include: {
                students: true,
              },
            },
          },
        },
        groups: {
          include: {
            course: true,
            students: true,
          },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const { password, ...userWithoutPassword } = user;
    return new Response(JSON.stringify({ user: userWithoutPassword }), {
      status: 200,
    });
  } catch (error) {
    console.error("ME API error:", error);
    return new Response(
      JSON.stringify({ error: "An internal server error occurred" }),
      {
        status: 500,
      }
    );
  }
}
