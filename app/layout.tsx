import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mental Gym",
  description: "A private NCAA cross country mental performance app."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
