import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getLoggedInUser } from "@/lib/auth"; // Use custom JWT authentication

export async function GET(request, { params }) {

  const loggedInUser = await getLoggedInUser();



  if (!loggedInUser) {

    return new NextResponse("Unauthorized", { status: 401 });

  }



  const { id } = await params; // Await params



  try {

    const exam = await prisma.exam.findUnique({

      where: { id },

      include: {

        group: { select: { id: true, name: true } },

        teacher: { select: { id: true, firstName: true, lastName: true } },

      },

    });



    if (!exam) {

      return new NextResponse("Exam not found", { status: 404 });

    }



    // Authorization check

    if (loggedInUser.role === "ADMIN" || (loggedInUser.role === "TEACHER" && exam.teacherId === loggedInUser.id)) {

      return NextResponse.json(exam);

    } else {

      return new NextResponse("Forbidden", { status: 403 });

    }

  } catch (error) {

    console.error("Error fetching exam:", error);

    return new NextResponse("Internal Server Error", { status: 500 });

  }

}



export async function PUT(request, { params }) {

  const loggedInUser = await getLoggedInUser();



  if (!loggedInUser) {

    return new NextResponse("Unauthorized", { status: 401 });

  }



  const { id } = await params; // Await params



  try {

    const existingExam = await prisma.exam.findUnique({

      where: { id },

    });



    if (!existingExam) {

      return new NextResponse("Exam not found", { status: 404 });

    }



    // Authorization check

    if (loggedInUser.role === "ADMIN" || (loggedInUser.role === "TEACHER" && existingExam.teacherId === loggedInUser.id)) {

      const body = await request.json();

      const { title, description, examDate } = body;



      if (!title || !examDate) {

        return new NextResponse("Missing required fields", { status: 400 });

      }



      const updatedExam = await prisma.exam.update({

        where: { id },

        data: {

          title,

          description,

          examDate: new Date(examDate),

        },

      });

      return NextResponse.json(updatedExam);

    } else {

      return new NextResponse("Forbidden", { status: 403 });

    }

  } catch (error) {

    console.error("Error updating exam:", error);

    return new NextResponse("Internal Server Error", { status: 500 });

  }

}



export async function DELETE(request, { params }) {

  const loggedInUser = await getLoggedInUser();



  if (!loggedInUser) {

    return new NextResponse("Unauthorized", { status: 401 });

  }



  const { id } = await params; // Await params



  try {

    const existingExam = await prisma.exam.findUnique({

      where: { id },

    });



    if (!existingExam) {

      return new NextResponse("Exam not found", { status: 404 });

    }



    // Authorization check

    if (loggedInUser.role === "ADMIN" || (loggedInUser.role === "TEACHER" && existingExam.teacherId === loggedInUser.id)) {

      await prisma.exam.delete({

        where: { id },

      });

      return new NextResponse("Exam deleted successfully", { status: 200 });

    } else {

      return new NextResponse("Forbidden", { status: 403 });

    }

  } catch (error) {

    console.error("Error deleting exam:", error);

    return new NextResponse("Internal Server Error", { status: 500 });

  }

}
