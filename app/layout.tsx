import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://proofplay-alpha.vercel.app"),
  title: {
    default: "ProofPlay — Learning You Can Prove",
    template: "%s | ProofPlay",
  },
  description:
    "ProofPlay turns young learners' explanations and demonstrations into evidence-based Living Skill Cards and later checks what they remember.",
  applicationName: "ProofPlay",
  keywords: [
    "evidence-based learning",
    "young learners",
    "learning retention",
    "skill cards",
    "education technology",
  ],
  authors: [{ name: "Faith Oluwalana" }],
  creator: "Faith Oluwalana",
  openGraph: {
    title: "ProofPlay — Learning You Can Prove",
    description:
      "Explain it, demonstrate it, and turn real understanding into living proof.",
    url: "https://proofplay-alpha.vercel.app",
    siteName: "ProofPlay",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProofPlay — Learning You Can Prove",
    description:
      "Explain it, demonstrate it, and turn real understanding into living proof.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
