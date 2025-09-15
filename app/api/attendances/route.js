import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET all attendances or one by ?id=
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const record = await prisma.attendance.findUnique({
        where: { id },
        include: {
          user: true,
          course: true,
          status: true,
          overtimeSession: true,
          qrCodeSession: true,
        },
      });

      if (!record) {
        return new Response(JSON.stringify({ error: "Attendance not found" }), {
          status: 404,
        });
      }

      return new Response(JSON.stringify(record), { status: 200 });
    }

    const records = await prisma.attendance.findMany({
      include: {
        user: true,
        course: true,
        status: true,
        overtimeSession: true,
        qrCodeSession: true,
      },
    });

    return new Response(JSON.stringify(records), { status: 200 });
  } catch (error) {
    console.error("GET Attendance Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// POST new attendance
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      courseId,
      statusId,
      date,
      checkIn,
      checkOut,
      qrCode,
      overtimeSessionId,
      qrCodeSessionId,
    } = body;

    if (!userId || !statusId || !date || !checkIn) {
      return new Response(
        JSON.stringify({
          error: "userId, statusId, date, and checkIn are required",
        }),
        { status: 400 }
      );
    }

    const newRecord = await prisma.attendance.create({
      data: {
        userId,
        courseId: courseId || null,
        statusId,
        date: new Date(date),
        checkIn: new Date(checkIn),
        checkOut: checkOut ? new Date(checkOut) : null,
        qrCode: qrCode || null,
        overtimeSessionId: overtimeSessionId || null,
        qrCodeSessionId: qrCodeSessionId || null,
      },
    });

    return new Response(JSON.stringify(newRecord), { status: 201 });
  } catch (error) {
    console.error("POST Attendance Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// PUT update attendance
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Attendance ID is required" }),
        { status: 400 }
      );
    }

    // Convert date strings to Date objects
    const parsedData = { ...updateData };
    if (parsedData.date) parsedData.date = new Date(parsedData.date);
    if (parsedData.checkIn) parsedData.checkIn = new Date(parsedData.checkIn);
    if (parsedData.checkOut)
      parsedData.checkOut = new Date(parsedData.checkOut);

    const updatedRecord = await prisma.attendance.update({
      where: { id },
      data: parsedData,
    });

    return new Response(JSON.stringify(updatedRecord), { status: 200 });
  } catch (error) {
    console.error("PUT Attendance Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

// DELETE attendance
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Attendance ID is required" }),
        { status: 400 }
      );
    }

    await prisma.attendance.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Attendance Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
