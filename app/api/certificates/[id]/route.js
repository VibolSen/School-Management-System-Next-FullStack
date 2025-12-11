import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Certificate ID is required" },
        { status: 400 }
      );
    }

    const certificate = await prisma.certificate.findUnique({
      where: { id: id.toString() },
      include: {
        course: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { message: "Certificate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(certificate);
  } catch (error) {
    console.error("Error fetching certificate:", error);
    return NextResponse.json(
      { message: "Failed to fetch certificate", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await prisma.certificate.delete({
      where: { id: id.toString() },
    });

    return NextResponse.json({
      message: "Certificate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { message: "Failed to delete certificate", error: error.message },
      { status: 500 }
    );
  }
}
