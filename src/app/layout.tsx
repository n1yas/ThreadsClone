import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import QueryProvider from "@/providers/QueryClient";
import ReduxProvider from "@/providers/ReduxProvider";
import ToastProvider from "@/Components/ToastProvider";
import Sidebar from "@/Components/Sidebar";
import { ThemeProvider } from "@/providers/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Threads",
  description:
    "Join the conversation with our Threads, Share your thoughts, follow friends, and stay updated in real-time,trending topics,posts ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <ReduxProvider>
        <QueryProvider>
          <ThemeProvider>

        <ToastProvider/>
         <Sidebar/>
          {children}
          </ThemeProvider>
        </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
