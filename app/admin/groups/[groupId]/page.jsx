// app/admin/groups/[groupId]/page.jsx
import { PrismaClient } from "@prisma/client";
import ManageGroupMembers from "./ManageGroupMembers"; // We will create this next
import Link from "next/link";

const prisma = new PrismaClient();

async function getGroupData(groupId) {
  // Fetch the specific group and its currently enrolled students
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      course: true, // Include course for context
      students: {
        // Include the full student objects
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  // Fetch all users who are students
  const allStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  return { group, allStudents };
}

export default async function ManageGroupPage({ params }) {
  const { groupId } = params;
  const { group, allStudents } = await getGroupData(groupId);

  if (!group) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold">Group Not Found</h1>
        <p>The group you are looking for does not exist.</p>
        <Link
          href="/admin/groups"
          className="text-blue-600 hover:underline mt-4 inline-block"
        >
          &larr; Back to Groups
        </Link>
      </div>
    );
  }

  return <ManageGroupMembers initialGroup={group} allStudents={allStudents} />;
}
