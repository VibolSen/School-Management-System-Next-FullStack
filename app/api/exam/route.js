import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =================================================================
// =====                  GET /api/exam (Read Exams)             =====
// =================================================================
/**
 * Fetches exams. This function does not require authentication.
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const courseId = searchParams.get("courseId");

    // --- Scenario 1: Fetch a SINGLE exam by its ID ---
    if (id) {
      const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
          course: { select: { title: true } }, // Include the title of the related course
          instructor: { select: { name: true } }, // Include the name of the related instructor
        },
      });

      // If no exam is found with that ID, return a 404 error
      if (!exam) {
        return new Response(JSON.stringify({ error: "Exam not found" }), {
          status: 404,
        });
      }

      // If found, return the exam data
      return new Response(JSON.stringify(exam), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Scenario 2: Fetch a LIST of all exams ---
    const whereClause = {};
    if (courseId) {
      whereClause.courseId = courseId; // Add a filter if a courseId is provided
    }

    const exams = await prisma.exam.findMany({
      where: whereClause,
      include: {
        course: { select: { title: true } }, // Also include related data for the list
        instructor: { select: { name: true } },
      },
      orderBy: {
        startDate: "desc", // Order the exams with the newest first
      },
    });

    // Return the list of exams (will be an empty array [] if none are found)
    return new Response(JSON.stringify(exams), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // --- ADVANCED ERROR HANDLING ---
    // This block will catch any crash that happens in the `try` block above.
    // The full, detailed error will be printed ONLY in your server terminal.
    console.error("--- GET /api/exam CRASHED ---");
    console.error("The full error object from Prisma is:", error);
    // --- END ADVANCED ERROR HANDLING ---

    // Send a generic, user-friendly error message to the frontend.
    return new Response(
      JSON.stringify({
        error:
          "An internal server error occurred. Check the server terminal for the full error details.",
      }),
      { status: 500 } // 500 Internal Server Error
    );
  }
}

// =================================================================
// =====               POST /api/exam (Create Exam)              =====
// =================================================================
/**
 * Creates a new exam.
 * WARNING: This is INSECURE. It trusts the `instructorId` sent from the client.
 */
export async function POST(req) {
  try {
    const data = await req.json();

    // Validation
    if (!data.instructorId) {
      return new Response(
        JSON.stringify({ error: "Instructor ID is required." }),
        { status: 400 }
      );
    }
    if (!data.title?.trim())
      return new Response(JSON.stringify({ error: "Title is required." }), {
        status: 400,
      });
    if (!data.courseId)
      return new Response(JSON.stringify({ error: "Course is required." }), {
        status: 400,
      });

    // The database will automatically add `type: "ANYTIME"` because of the schema default.
    const newExam = await prisma.exam.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        duration: data.duration,
        courseId: data.courseId,
        instructorId: data.instructorId,
      },
    });

    return new Response(JSON.stringify(newExam), { status: 201 });
  } catch (error) {
    console.error("FULL PRISMA ERROR:", error); // Keep this for debugging
    if (error.code === "P2003")
      return new Response(
        JSON.stringify({ error: "Invalid course or instructor ID." }),
        { status: 400 }
      );
    return new Response(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}

// =================================================================
// =====                PUT /api/exam (Update Exam)              =====
// =================================================================
/**
 * Updates an existing exam.
 * WARNING: This is INSECURE. It does not check who is making the update request.
 */
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return new Response(
        JSON.stringify({ error: "Exam ID is required for updating." }),
        { status: 400 }
      );

    // REMOVED: All security checks. Anyone who knows an exam ID can update it.
    const data = await req.json();

    const updatedExam = await prisma.exam.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        duration: data.duration,
        courseId: data.courseId,
      },
    });

    return new Response(JSON.stringify(updatedExam), { status: 200 });
  } catch (error) {
    console.error("PUT /api/exam Error:", error);
    if (error.code === "P2025")
      return new Response(JSON.stringify({ error: "Exam not found." }), {
        status: 404,
      });
    return new Response(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}

// =================================================================
// =====              DELETE /api/exam (Delete Exam)             =====
// =================================================================
/**
 * Deletes an exam.
 * WARNING: This is INSECURE. It does not check who is making the delete request.
 */
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
      return new Response(
        JSON.stringify({ error: "Exam ID is required for deletion." }),
        { status: 400 }
      );

    // REMOVED: All security checks. Anyone who knows an exam ID can delete it.
    await prisma.exam.delete({
      where: { id },
    });

    return new Response(
      JSON.stringify({ message: "Exam deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/exam Error:", error);
    if (error.code === "P2025")
      return new Response(JSON.stringify({ error: "Exam not found." }), {
        status: 404,
      });
    return new Response(
      JSON.stringify({ error: "An internal server error occurred." }),
      { status: 500 }
    );
  }
}
