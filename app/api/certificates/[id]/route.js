import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(request, props) {
  try {
    const { id } = props.params;

    if (!id) {
      return NextResponse.json(
        { message: "Certificate ID is required" },
        { status: 400 }
      );
    }

    await prisma.certificate.delete({
      where: { id: id.toString() },
    });

    return NextResponse.json({ message: "Certificate deleted successfully" });
  } catch (error) {
    console.error("Error deleting certificate:", error);
    return NextResponse.json(
      { message: "Failed to delete certificate", error: error.message },
      { status: 500 }
    );
  }
}
