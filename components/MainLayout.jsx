// // --- START OF FILE MainLayout.tsx ---

// "use client";

// import React, { useState } from "react";
// import Sidebar from "@/components/Sidebar";
// import Header from "@/components/Header";
// import { useUser } from "@/context/UserContext";
// import { ViewType } from "@/lib/types"; // Import ViewType

// export default function MainLayout({
//   children,
// }: {
//   children.ReactNode;
// }) {
//   const [isSidebarOpen, setSidebarOpen] = useState(true);
//   const { currentUserRole } = useUser(); // Removed setCurrentUserRole as it's not used here
//   const [currentView, setCurrentView] = useState("Dashboard"); // Add state for currentView

//   return (
//     <div className="flex h-screen bg-slate-100">
//       <Sidebar
//         isOpen={isSidebarOpen}
//         setIsOpen={setSidebarOpen}
//         currentUserRole={currentUserRole}
//         currentView={currentView} // Pass currentView
//         setCurrentView={setCurrentView} // Pass setCurrentView
//       />
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
//         <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 md:p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }
