import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "社群会员管理系统",
  description: "快速便捷的会员积分与身份核验工具",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className={inter.className}>
        <AuthProvider>
          <main className="min-h-screen max-w-md mx-auto relative bg-background">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
