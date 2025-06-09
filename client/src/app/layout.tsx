import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Page from "@/app/sign-in/[[...sign-in]]/page";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import "./globals.css";

// Import the ClientProviders wrapper
import { ClientProviders } from "./ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EYIDE",
  description: "AI-powered business intelligence platform providing comprehensive fraud detection, revenue analysis, market insights, and data-driven analytics to empower smarter business decisions.",
  icons: {
    icon: "/eye.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <script type="text/javascript" src="https://res.cloudinary.com/veseylab/raw/upload/v1684982764/magicmouse-2.0.0.cdn.min.js"></script>
          {/* <script dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                try {
                  if (typeof magicMouse === 'function') {
                    magicMouse({
                      cursorOuter: "circle-basic",
                      hoverEffect: "circle-move",
                      hoverItemMove: false,
                      defaultCursor: false,
                      outerWidth: 30,
                      outerHeight: 30
                    });
                    console.log("Magic Mouse initialized from inline script");
                  } else {
                    console.warn("Magic Mouse function not found");
                  }
                } catch (e) {
                  console.error("Magic Mouse inline initialization error:", e);
                }
              });
            `
          }} /> */}
        </head>
        <body className="bg-[#0E1111]" id="magicMouseBody">
          <SignedOut>
            <Page />
          </SignedOut>
          <SignedIn>
            {/* Use the ClientProviders wrapper here */}
            <ClientProviders>
              <main>{children}</main>
              {/* Modals are now inside ClientProviders */}
            </ClientProviders>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}
