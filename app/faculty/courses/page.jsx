import FacultyCoursesView from "@/components/course/FacultyCoursesView";

export default function CoursesPage({ searchParams }) {
  const loggedInUser = {
    id: searchParams.teacherId,
  };
  return <FacultyCoursesView loggedInUser={loggedInUser} />;
}