import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all sessions or one by ?id=
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const qrCodeSession = await prisma.qRCodeSession.findUnique({
        where: { id },
        include: {
          attendances: true,
          course: true,
          createdBy: true,
        },
      });

      if (!qrCodeSession) {
        return new Response(
          JSON.stringify({ error: "QRCodeSession not found" }),
          { status: 404 }
        );
      }

      return new Response(JSON.stringify(qrCodeSession), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const qrCodeSessions = await prisma.qRCodeSession.findMany({
      include: {
        attendances: true,
        course: true,
        createdBy: true,
      },
    });

    return new Response(JSON.stringify(qrCodeSessions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// POST new QRCodeSession
export async function POST(req) {
  try {
    const data = await req.json();

    if (!data.createdById || !data.qrCode || !data.expiresAt) {
      return new Response(
        JSON.stringify({
          error: "createdById, qrCode, and expiresAt are required",
        }),
        { status: 400 }
      );
    }

    // Validate that user exists
    const user = await prisma.user.findUnique({
      where: { id: data.createdById },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: "User (createdById) does not exist" }),
        { status: 400 }
      );
    }

    const qrCodeSession = await prisma.qRCodeSession.create({
      data: {
        courseId: data.courseId || null,
        createdById: data.createdById,
        qrCode: data.qrCode,
        expiresAt: new Date(data.expiresAt),
      },
      include: {
        course: true,
        createdBy: true,
      },
    });

    return new Response(JSON.stringify(qrCodeSession), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// PUT update QRCodeSession
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "QRCodeSession ID required" }),
        { status: 400 }
      );
    }

    const data = await req.json();

    // Optional: validate user exists if updating createdById
    if (data.createdById) {
      const user = await prisma.user.findUnique({
        where: { id: data.createdById },
      });
      if (!user) {
        return new Response(
          JSON.stringify({ error: "User (createdById) does not exist" }),
          { status: 400 }
        );
      }
    }

    const updatedQrCodeSession = await prisma.qRCodeSession.update({
      where: { id },
      data: {
        courseId: data.courseId || null,
        createdById: data.createdById,
        qrCode: data.qrCode,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      },
      include: {
        course: true,
        createdBy: true,
      },
    });

    return new Response(JSON.stringify(updatedQrCodeSession), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}

// DELETE session
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "QRCodeSession ID required" }),
        { status: 400 }
      );
    }

    const deletedQrCodeSession = await prisma.qRCodeSession.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedQrCodeSession), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
