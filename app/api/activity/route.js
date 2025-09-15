import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activityTypes = await prisma.activityTypeEnum.findMany({
      orderBy: { name: "asc" },
    });
    return new Response(JSON.stringify(activityTypes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("GET ActivityTypes error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

// POST create new activity type
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.name) {
      return new Response(JSON.stringify({ error: "Name is required" }), {
        status: 400,
      });
    }

    const newType = await prisma.activityTypeEnum.create({
      data: { name: data.name },
    });

    return new Response(JSON.stringify(newType), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("POST ActivityTypes error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// DELETE an activity type by id
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        status: 400,
      });
    }

    const deleted = await prisma.activityTypeEnum.delete({ where: { id } });

    return new Response(JSON.stringify(deleted), { status: 200 });
  } catch (error) {
    console.error("DELETE ActivityTypes error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
