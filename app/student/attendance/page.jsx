// import AttendanceView from "@/components/attendance/AttendanceView";
// import { cookies } from 'next/headers';

// async function getLoggedInUser(cookie) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
//     headers: {
//       'Cookie': cookie
//     }
//   });

//   if (!res.ok) {
//     return null;
//   }

//   return res.json();
// }

// export default async function AttendancePage() {
//   const cookie = cookies().toString();
//   const loggedInUser = await getLoggedInUser(cookie);

//   return <AttendanceView loggedInUser={loggedInUser} />;
// }

import NotFoundPage from "../../not-found";

export default function SettingsPage() {
  return <NotFoundPage />;
}
