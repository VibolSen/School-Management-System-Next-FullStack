import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

const prisma = new PrismaClient();

async function getCertificateHTML(certificate) {
  const courseName = certificate.course.name;
  const recipientName = certificate.recipient;
  const issueDate = new Date(certificate.issueDate).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');
        
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Inter', sans-serif;
          background: white;
        }
        
        .page {
          width: 297mm;
          height: 210mm;
          padding: 20mm;
          box-sizing: border-box;
          position: relative;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #334155;
        }

        /* Double Borders */
        .border-outer {
          position: absolute;
          top: 10mm;
          left: 10mm;
          right: 10mm;
          bottom: 10mm;
          border: 1px solid #e2e8f0;
        }
        .border-inner {
          position: absolute;
          top: 15mm;
          left: 15mm;
          right: 15mm;
          bottom: 15mm;
          border: 4px solid #f8fafc;
        }

        .content {
          position: relative;
          z-index: 10;
          width: 80%;
        }

        .logo {
          width: 180px;
          margin-bottom: 30px;
        }

        .certification-label {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 12px;
          font-weight: 900;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        h1 {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 48px;
          font-weight: 900;
          color: #0f172a;
          margin: 0 0 40px 0;
        }

        .presented-to {
          font-family: 'Playfair Display', serif;
          font-style: italic;
          font-size: 20px;
          color: #64748b;
          margin-bottom: 30px;
        }

        .recipient {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 900;
          color: #1d4ed8;
          margin-bottom: 30px;
          border-bottom: 2px solid #f1f5f9;
          display: inline-block;
          padding-bottom: 10px;
        }

        .description {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 30px;
        }

        .course-name {
          font-size: 32px;
          font-weight: 900;
          color: #1e293b;
          text-decoration: underline;
          text-decoration-color: #3b82f6;
          text-decoration-thickness: 4px;
          text-underline-offset: 8px;
        }

        .footer {
          margin-top: 60px;
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .footer-item {
          width: 200px;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
        }

        .footer-label {
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 0.1em;
          font-weight: 900;
          color: #94a3b8;
          margin-bottom: 5px;
        }

        .footer-value {
          font-size: 16px;
          font-weight: 700;
          color: #1e293b;
        }

        .seal {
          width: 80px;
          opacity: 0.3;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div class="border-outer"></div>
        <div class="border-inner"></div>
        
        <div class="content">
          <img src="http://localhost:3000/logo/STEP.png" class="logo" />
          
          <div class="certification-label">Academy Professional Certification</div>
          
          <h1>Certificate of Achievement</h1>
          
          <div class="presented-to">This document is proudly presented to</div>
          
          <div class="recipient">${recipientName}</div>
          
          <div class="description">
            for demonstrating exceptional performance and high commitment in successfully completing the training program for
          </div>
          
          <div class="course-name">${courseName}</div>
          
          <div class="footer">
            <div class="footer-item" style="text-align: left;">
              <div class="footer-label">Issue Date</div>
              <div class="footer-value">${issueDate}</div>
            </div>
            
            <img src="https://img.icons8.com/ios-filled/100/1d4ed8/verified-badge.png" class="seal" />
            
            <div class="footer-item" style="text-align: right;">
              <div class="footer-label">Verification ID</div>
              <div class="footer-value">${certificate.id.slice(0, 8).toUpperCase()}...</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!certificate) {
      return NextResponse.json({ message: 'Certificate not found' }, { status: 404 });
    }

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    const htmlContent = await getCertificateHTML(certificate);
    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ 
      format: 'A4',
      landscape: true,
      printBackground: true
    });

    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${certificate.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error(`Error generating PDF for certificate with id: ${id}`, error);
    return NextResponse.json({ message: 'Failed to generate PDF' }, { status: 500 });
  }
}