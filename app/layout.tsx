import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Mental Health Assessment Tool- Instant Diagnosis Finder",
  description:
    "Find potential DSM diagnoses by entering client symptoms and history. Our clinical decision support tool helps mental health professionals explore diagnostic possibilities and build differential diagnoses for more accurate assessment.",
};
interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Favicon link */}
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={metadata.description} />
        <title>{metadata.title}</title>
      </head>
      <body className="flex min-h-screen w-full flex-col bg-[#f5f5f5]">
        {children}
        <Toaster />{" "}
        {/* Add the Toaster here to ensure toast notifications are displayed */}
      </body>
    </html>
  );
}
