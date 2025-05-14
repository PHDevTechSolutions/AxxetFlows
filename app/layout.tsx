import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for react-toastify
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AxxetFlow | Inventory Management System",
  description: "Created in NextJs Developed By PH Dev-Tech Solutions",
  icons: {
    icon: "/assetflow-logo.png", // Favicon for the tab bar
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon for the browser tab */}
        <link rel="icon" href="/assetflow-logo.png" type="image/png" className="rounded-full" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer /> {/* This makes sure toasts show up */}
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
