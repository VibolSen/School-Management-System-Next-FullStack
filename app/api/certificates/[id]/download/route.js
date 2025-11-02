import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import pdf from 'html-pdf';

const prisma = new PrismaClient();

const generateCertificateHTML = (certificate, courseName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        .container { width: 800px; margin: auto; padding: 50px; border: 10px solid #eee; }
        h1 { font-size: 50px; }
        h2 { font-size: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Certificate of Completion</h1>
        <h2>This is to certify that</h2>
        <h1>${certificate.recipient}</h1>
        <h2>has successfully completed the course</h2>
        <h1>${courseName}</h1>
        <h2>on ${new Date(certificate.issueDate).toLocaleDateString()}</h2>
      </div>
    </body>
    </html>
  `;
};

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    const courseName = certificate.course ? certificate.course.name : 'Unknown Course';
    const html = generateCertificateHTML(certificate, courseName);

    return new Promise((resolve, reject) => {
      pdf.create(html).toBuffer((err, buffer) => {
        if (err) {
          console.error("Error generating PDF:", err);
          reject(NextResponse.json({ message: "Failed to generate PDF" }, { status: 500 }));
        } else {
          const response = new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `attachment; filename="certificate-${certificate.uniqueId}.pdf"`,
            },
          });
          resolve(response);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json({ message: "Failed to fetch certificate" }, { status: 500 });
  }
}
