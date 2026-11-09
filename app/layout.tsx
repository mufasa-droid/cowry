import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cowry BRT Lagos",
  description: "Mobile-first BRT Lagos departures and bus stop guide",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1558B0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 sm:py-6 flex justify-center">
        <main className="w-full max-w-[430px] min-h-screen bg-white shadow-sm flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

