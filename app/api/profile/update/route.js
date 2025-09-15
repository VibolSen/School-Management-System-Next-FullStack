import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const runtime = "nodejs";

export async function PUT(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    // Parse multipart form data
    const formData = await req.formData();
    const name = formData.get("name")?.toString();
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
        ...(name && { name }),
        ...(imagePath && { image: imagePath }),
      },
      include: { role: true },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return new Response(JSON.stringify({ user: userWithoutPassword }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
