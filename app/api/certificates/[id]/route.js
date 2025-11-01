import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { course: true, template: true },
    });

    if (certificate) {
      return NextResponse.json(certificate);
    } else {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json({ message: "Failed to fetch certificate" }, { status: 500 });
  }
}
