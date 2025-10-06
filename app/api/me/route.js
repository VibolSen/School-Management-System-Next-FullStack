import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

export async function GET(req) {
  console.log("--- /api/me endpoint called ---");
  try {
    const token = req.cookies.get("token")?.value;
    console.log("Token:", token);

    if (!token) {
      console.log("No token provided");
      return new Response(JSON.stringify({ error: "No token provided" }), {
        status: 401,
      });
    }

    let decoded;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      decoded = payload;
      console.log("Decoded token:", decoded);
    } catch (err) {
      console.error("Invalid token:", err);
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true, // Include the user's profile
        department: true,
        ledCourses: {
          include: {
            courseDepartments: {
              include: {
                department: true,
              },
            },
            groups: {
              include: {
                students: true,
              },
            },
          },
        },
        groups: {
          include: {
            courses: true,
            students: true,
          },
        },
      },
    });

    if (!user) {
      console.log("User not found");
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    console.log("User found:", user);
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
