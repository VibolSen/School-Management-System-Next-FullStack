import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ===== GET all or by ?id= =====
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const item = await prisma.materialTypeEnum.findUnique({ where: { id } });
    if (!item)
      return new Response(JSON.stringify({ error: "MaterialTypeEnum not found" }), { status: 404 });
    return new Response(JSON.stringify(item), { status: 200, headers: { "Content-Type": "application/json" } });
  }

  const items = await prisma.materialTypeEnum.findMany();
  return new Response(JSON.stringify(items), { status: 200, headers: { "Content-Type": "application/json" } });
}

// ===== POST create new =====
export async function POST(req) {
  const data = await req.json();
  try {
    const item = await prisma.materialTypeEnum.create({
      data: { name: data.name },
    });
    return new Response(JSON.stringify(item), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Create MaterialTypeEnum error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// ===== PUT update by ?id= =====
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });

    const data = await req.json();
    if (!data.name || !data.name.trim()) {
      return new Response(JSON.stringify({ error: "Name is required" }), { status: 400 });
    }

    const existing = await prisma.materialTypeEnum.findUnique({ where: { id } });
    if (!existing) return new Response(JSON.stringify({ error: "Record not found" }), { status: 404 });

    const updated = await prisma.materialTypeEnum.update({
      where: { id },
      data: { name: data.name },
    });

    return new Response(JSON.stringify(updated), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Update MaterialTypeEnum error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

// ===== DELETE by ?id= =====
export async function DELETE(req) {
    try {
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
      if (!id) return new Response(JSON.stringify({ error: "ID required" }), { status: 400 });
  
      // Check if the record exists first
      const existing = await prisma.materialTypeEnum.findUnique({ where: { id } });
      if (!existing) {
        return new Response(JSON.stringify({ error: "Record not found" }), { status: 404 });
      }
  
      // Delete the record
      const deleted = await prisma.materialTypeEnum.delete({ where: { id } });
  
      return new Response(JSON.stringify(deleted), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Delete MaterialTypeEnum error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  }
  