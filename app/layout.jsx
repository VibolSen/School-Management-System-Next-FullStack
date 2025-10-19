import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/context/UserContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Management System",
  description: "School Management System",
  // Add this 'icons' object back in, pointing to your PNG file
  icons: {
    icon: "/logo/favicon2.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
