import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
export const runtime = "nodejs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "upload", "Library");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ===== GET all library resources =====
export async function GET(req) {
  try {
    const resources = await prisma.libraryResource.findMany({
      orderBy: { createdAt: "desc" },
      include: { uploadedBy: true, type: true },
    });

    return new Response(JSON.stringify(resources), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("GET error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ===== POST create new resource =====
export async function POST(req) {
  try {
    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const author = formData.get("author")?.toString();
    const department = formData.get("department")?.toString();
    const publicationYear = parseInt(formData.get("publicationYear"));
    const description = formData.get("description")?.toString();
    const uploadedById = formData.get("uploadedById")?.toString();
    const typeId = formData.get("typeId")?.toString();
    const file = formData.get("coverImage");

    if (!title || !author || !department || !publicationYear || !uploadedById || !typeId || !file) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(filePath, buffer);
    const fileUrl = `/upload/Library/${fileName}`;

    const newItem = await prisma.libraryResource.create({
      data: {
        title,
        author,
        department,
        publicationYear,
        description,
        fileUrl,
        uploadedBy: { connect: { id: uploadedById } },
        type: { connect: { id: typeId } },
      },
    });

    return new Response(JSON.stringify(newItem), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("POST error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// ===== PUT update resource by ?id= =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Item ID required" }), { status: 400 });

    const formData = await req.formData();
    const title = formData.get("title")?.toString();
    const author = formData.get("author")?.toString();
    const department = formData.get("department")?.toString();
    const publicationYear = parseInt(formData.get("publicationYear"));
    const description = formData.get("description")?.toString();
    const typeId = formData.get("typeId")?.toString();
    const file = formData.get("coverImage");

    // Fetch existing resource to get old file URL
    const existingItem = await prisma.libraryResource.findUnique({ where: { id } });
    if (!existingItem) return new Response(JSON.stringify({ error: "Resource not found" }), { status: 404 });

    let fileUrl = existingItem.fileUrl; // default to existing file
    if (file && file.size > 0) {
      // Delete old file if it exists
      if (existingItem.fileUrl) {
        const oldFilePath = path.join(process.cwd(), "public", existingItem.fileUrl);
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
      }

      // Save new file
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(UPLOAD_DIR, fileName);
      fs.writeFileSync(filePath, buffer);
      fileUrl = `/upload/Library/${fileName}`;
    }

    const updateData = {
      ...(title && { title }),
      ...(author && { author }),
      ...(department && { department }),
      ...(publicationYear && { publicationYear }),
      ...(description && { description }),
      ...(fileUrl && { fileUrl }),
      ...(typeId && { type: { connect: { id: typeId } } }),
    };

    const updatedItem = await prisma.libraryResource.update({
      where: { id },
      data: updateData,
    });

    return new Response(JSON.stringify(updatedItem), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("PUT error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}


// ===== DELETE resource by ?id= =====
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "Item ID required" }), { status: 400 });

    // Fetch the resource first to get the file URL
    const existingItem = await prisma.libraryResource.findUnique({ where: { id } });
    if (!existingItem) return new Response(JSON.stringify({ error: "Resource not found" }), { status: 404 });

    // Delete the file if it exists
    if (existingItem.fileUrl) {
      const filePath = path.join(process.cwd(), "public", existingItem.fileUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // Delete the database record
    const deletedItem = await prisma.libraryResource.delete({ where: { id } });

    return new Response(JSON.stringify({ success: true, deletedItem }), { status: 200 });
  } catch (err) {
    console.error("DELETE error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
