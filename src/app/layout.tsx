import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "sonner";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "MsgBox - Anonymous Messages",
  description: "Receive anonymous messages from your friends",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          {children}
          <Toaster
  position="top-right"
  richColors
  closeButton
  duration={3000}
/>
        </AuthProvider>
      </body>
    </html>
  );
}
