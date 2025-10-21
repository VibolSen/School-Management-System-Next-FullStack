import { Inter } from "next/font/google";
import "./globals.css";
import RootLayout from "./layout.jsx"; // Import the client RootLayout

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Management System",
  description: "School Management System",
  icons: {
    icon: "/logo/favicon2.ico",
  },
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <RootLayout interClassName={inter.className}>{children}</RootLayout>
      </body>
    </html>
  );
}
