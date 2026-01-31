import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { course: true, template: true },
    });

    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    const sanitizedCertificate = {
      ...certificate,
      template: certificate.template
        ? {
            ...certificate.template,
            content: certificate.template.content || '',
          }
        : null,
    };

    return NextResponse.json(sanitizedCertificate);
  } catch (error) {
    console.error(`Error fetching certificate with id: ${id}`, error);
    return NextResponse.json({ message: 'Failed to fetch certificate' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await prisma.certificate.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error(`Error deleting certificate with id: ${id}`, error);
    return NextResponse.json({ message: 'Failed to delete certificate' }, { status: 500 });
  }
}