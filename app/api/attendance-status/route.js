import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const statuses = await prisma.attendanceStatusEnum.findMany({
      include: { attendances: true },
    });
    return new Response(JSON.stringify(statuses), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('GET AttendanceStatusEnum error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    if (!data.name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const status = await prisma.attendanceStatusEnum.create({
      data: { name: data.name },
    });

    return new Response(JSON.stringify(status), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('POST AttendanceStatusEnum error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'AttendanceStatusEnum ID is required' }), { status: 400 });
    }

    const data = await req.json();
    if (!data.name) {
      return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const updatedStatus = await prisma.attendanceStatusEnum.update({
      where: { id },
      data: { name: data.name },
    });

    return new Response(JSON.stringify(updatedStatus), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('PUT AttendanceStatusEnum error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'AttendanceStatusEnum ID is required' }), { status: 400 });
    }

    const deletedStatus = await prisma.attendanceStatusEnum.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deletedStatus), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('DELETE AttendanceStatusEnum error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }
}
