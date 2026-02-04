import { Inter } from "next/font/google";
import "./globals.css";
import "./darkmode.css";
import "./accessibility.css";
import { UserProvider } from "@/context/UserContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "School Management System",
  description: "School Management System",
  icons: {
    icon: "/favicon.ico", // ✅ points to /public/favicon.ico
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AccessibilityProvider>
          <ThemeProvider>
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
