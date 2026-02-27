
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

import AuthProvider from "@/components/AuthProvider";
import CartoonMascot from "@/components/CartoonMascot";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SK Associates & Builders",
  description: "Invest in the Future of Living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-slate-50 text-slate-900`}
      >
        <AuthProvider>
          <Toaster position="top-center" />
          <ScrollReveal />
          <Navbar />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <Footer />
          <CartoonMascot />
        </AuthProvider>
      </body>
    </html>
  );
}

