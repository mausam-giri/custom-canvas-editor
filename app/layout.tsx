import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Praman Patra",
  description: "Generate e-Certificates with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-200">
        {children}
        <Toaster closeButton richColors position="top-right" />
      </body>
    </html>
  );
}
