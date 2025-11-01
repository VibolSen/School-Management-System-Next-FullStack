import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({
      include: { course: true, template: true },
    });

    const sanitizedCertificates = certificates.map(certificate => ({
      ...certificate,
      template: certificate.template ? {
        ...certificate.template,
        content: certificate.template.content || '',
      } : null,
    }));

    return NextResponse.json(sanitizedCertificates);
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return NextResponse.json({ message: "Failed to fetch certificates" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { recipient, courseId, issueDate, expiryDate, templateId, uniqueId } = await request.json();
    const newCertificate = await prisma.certificate.create({
      data: {
        recipient,
        courseId,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        templateId,
        uniqueId,
      },
    });
    return NextResponse.json(newCertificate, { status: 201 });
  } catch (error) {
    console.error("Error creating certificate:", error);
    return NextResponse.json({ message: "Failed to create certificate" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, recipient, courseId, issueDate, expiryDate, templateId, uniqueId } = await request.json();
    const updatedCertificate = await prisma.certificate.update({
      where: { id },
      data: {
        recipient,
        courseId,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        templateId,
        uniqueId,
      },
    });
    return NextResponse.json(updatedCertificate);
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json({ message: "Failed to update certificate" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.certificate.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Certificate deleted' });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json({ message: "Failed to delete certificate" }, { status: 500 });
  }
}
