// app/api/library/route.js
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import { join } from "path";

// GET all resources
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const departmentId = searchParams.get("departmentId");

  try {
    const resources = await prisma.libraryResource.findMany({
      where: departmentId ? { department: departmentId } : {},
      include: {
        uploadedBy: true,
      },
    });
    return NextResponse.json(resources);
  } catch (error) {
    console.error("Failed to fetch resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST a new resource
export async function POST(request) {
  try {
    const data = await request.formData();
    const title = data.get("title");
    const author = data.get("author");
    const uploadedById = data.get("uploadedById");
    const department = data.get("department");
    const description = data.get("description");
    const publicationYear = data.get("publicationYear");
    const coverImage = data.get("coverImage");

    if (!title || !author || !uploadedById || !coverImage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const bytes = await coverImage.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = join(process.cwd(), "public", "upload");
    const imagePath = join(publicDir, coverImage.name);
    await writeFile(imagePath, buffer);
    const coverImageUrl = `/upload/${coverImage.name}`;

    const resource = await prisma.libraryResource.create({
      data: {
        title,
        author,
        coverImage: coverImageUrl,
        uploadedById,
        department,
        description,
        publicationYear: publicationYear ? parseInt(publicationYear) : null,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Failed to create resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

// PUT to update a resource
export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await request.formData();
    const title = data.get("title");
    const author = data.get("author");
    const department = data.get("department");
    const description = data.get("description");
    const publicationYear = data.get("publicationYear");
    const coverImage = data.get("coverImage");

    let coverImageUrl;
    if (coverImage && typeof coverImage.arrayBuffer === "function") {
      const bytes = await coverImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const publicDir = join(process.cwd(), "public", "upload");
      const imagePath = join(publicDir, coverImage.name);
      await writeFile(imagePath, buffer);
      coverImageUrl = `/upload/${coverImage.name}`;
    }

    const updateData = {
      title,
      author,
      department,
      description,
      publicationYear: publicationYear ? parseInt(publicationYear) : null,
    };

    if (coverImageUrl) {
      updateData.coverImage = coverImageUrl;
    }

    const resource = await prisma.libraryResource.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("Failed to update resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// DELETE a resource
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await prisma.libraryResource.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Failed to delete resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
