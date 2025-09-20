import CourseAnalyticsView from "@/components/course/CourseAnalyticsView";
import { getLoggedInUser } from "@/lib/auth"; // Assuming you have a helper for this

export default async function CourseAnalyticsPage() {
  const loggedInUser = await getLoggedInUser();

  if (!loggedInUser) {
    return (
      <div className="p-8">
        Error: Could not authenticate user. Please log in again.
      </div>
    );
  }

  return <CourseAnalyticsView loggedInUser={loggedInUser} />;
}