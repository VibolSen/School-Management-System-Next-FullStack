import { PrismaClient } from "@prisma/client";
import GroupDetailPage from "@/components/group/GroupDetailPage"; // Adjust path as needed
import Link from "next/link";

const prisma = new PrismaClient();

async function getGroupData(groupId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      courses: true,
      students: {
        select: { id: true, firstName: true, lastName: true, email: true },
      },
    },
  });

  const allStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: { id: true, firstName: true, lastName: true, email: true },
  });

  return { group, allStudents };
}

export default async function GroupDetailPageRoute({ params }) {
  const { groupId } = await params; // params must be awaited in Next.js 15

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

  return <GroupDetailPage initialGroup={group} allStudents={allStudents} role="admin" />;
}