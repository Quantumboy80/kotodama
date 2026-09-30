import type { Metadata } from "next";
import "./globals.css";
import Umami from "@/components/auth/Umami";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { DeviceFingerprint } from "@/components/auth/DeviceFingerprint";
import { ViewTransitions } from "next-view-transitions";
import Footer from "@/components/core/Footer";
import { ReactLenis } from "@/utils/lenis";
import { Toaster } from "@/components/ui/sonner";
import MainNav from "@/components/core/MainNav";
import Head from "next/head";
import { ThemeInitScript } from "@/components/ui/ThemeInitScript";
import { GoogleAnalytics } from "@next/third-parties/google";

export const poppins = { variable: "font-poppins" };
export const lexend = { variable: "font-lexend" };
export const montserrat = { variable: "font-montserrat" };
export const roboto = { variable: "font-roboto" };
export const inter = { variable: "font-inter" };

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL || "http://stag.Kotodama.in",
  ),
  title: {
    default: "Kotodama - Study Smarter with AI-Powered Learning",
    template: "%s | Kotodama",
  },
  description:
    "Transform your learning experience with Kotodama - Access comprehensive study notes, interactive flashcards, AI-powered quizzes, and personalized study assistance. Join thousands of students achieving academic excellence.",
  keywords: [
    "study notes",
    "flashcards",
    "AI learning",
    "education",
    "student resources",
    "academic notes",
    "quiz platform",
    "study tools",
    "Kotodama",
    "Study smarter",
    "Engineering notes",
    "B.Tech notes",
    "College resources",
    "Semester notes",
    "PYQs",
    "Flashcards",
    "Quick learning",
    "Exam preparation",
    "AI-powered study",
    "Learning resources",
    "Simplified concepts",
    "Organized notes",
    "Efficient study tools",
    "Medicaps university",
    "notesera",
    "Kotodama notes",
    "b.tech notes",
    "b.tech first year notes",
    "b.tech second year notes",
    "b.tech third year notes",
    "b.tech fourth year notes",
    "b.tech semester notes",
    "b.tech semester 1 notes",
    "b.tech semester 2 notes",
    "b.tech semester 3 notes",
    "b.tech semester 4 notes",
    "b.tech semester 5 notes",
    "b.tech semester 6 notes",
    "b.tech semester 7 notes",
    "b.tech semester 8 notes",
  ],
  authors: [{ name: "Sayan Som", url: "https://sayan-som-portfolio.vercel.app/" }],
  creator: "Sayan Som",
  publisher: "Sayan Som",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  category: "education",
  openGraph: {
    title: "Kotodama - Study Smarter with AI-Powered Learning",
    description:
      "Transform your learning experience with Kotodama - Access comprehensive study notes, interactive flashcards, AI-powered quizzes, and personalized study assistance. Join thousands of students achieving academic excellence.",
    url: "/",
    siteName: "Kotodama",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Kotodama - Study Smarter with AI-Powered Learning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kotodama - Study Smarter with AI-Powered Learning",
    description:
      "Transform your learning experience with Kotodama - Access comprehensive study notes, interactive flashcards, AI-powered quizzes, and personalized study assistance.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true" && <Umami />}
        <ReactLenis root>
          <head>
            <ThemeInitScript />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Lexend:wght@400;700&family=Montserrat:wght@400;700&family=Roboto:wght@400;700&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
            {process.env.NODE_ENV === "development" && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    if (typeof window !== 'undefined') {
                      document.startViewTransition = function(cb) {
                        cb();
                        return {
                          finished: Promise.resolve(),
                          ready: Promise.resolve(),
                          updateCallbackDone: Promise.resolve(),
                          skipTransition: function() {}
                        };
                      };
                    }
                  `
                }}
              />
            )}
          </head>
          <body
            className={`${poppins.variable} ${lexend.variable} ${montserrat.variable} ${roboto.variable} ${inter.variable}`}
          >
            <DeviceFingerprint />
            <ThemeProvider defaultTheme="light" storageKey="kotodama-theme">
              <MainNav />
              {children}
              <Toaster />
              <Footer />
            </ThemeProvider>
          </body>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
        </ReactLenis>
      </html>
    </ViewTransitions>
  );
}


