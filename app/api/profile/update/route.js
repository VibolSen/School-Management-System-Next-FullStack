import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-that-is-long"
);

export const runtime = "nodejs";

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const { payload: decoded } = await jwtVerify(token, JWT_SECRET);

    // Parse multipart form data
    const formData = await req.formData();
    const firstName = formData.get("firstName")?.toString();
    const lastName = formData.get("lastName")?.toString();
    const imageFile = formData.get("image"); // File object

    let imagePath;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public/profile"); // changed folder
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      const fileName = `${Date.now()}_${imageFile.name}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      imagePath = `/profile/${fileName}`; // URL points to /profile
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
      },
    });

    if (imagePath) {
      await prisma.profile.upsert({
        where: { userId: decoded.userId },
        update: { avatar: imagePath },
        create: {
          userId: decoded.userId,
          avatar: imagePath,
        },
      });
    }

    const userWithProfile = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true },
    });

    const { password: _, ...userWithoutPassword } = userWithProfile;
    return new Response(JSON.stringify({ user: userWithoutPassword }), { status: 200 });
  } catch (err) {
    console.error("Error updating profile:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
