import type { Metadata } from "next";
import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from '../components/LightRays'
import Navbar from "@/components/Navbar";

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

 export const metadata: Metadata = {
  title: "Dev Event Day",
  description: "The Hub for every Dev Event, you should not miss.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk.variable} ${martianMono.variable} antialiased`}
      >
          <div className="absolute top-0 inset-0 z-[-1] min-h-screen">
            <LightRays
                raysOrigin="top-center-offset"
                raysColor="#00ffff"
                raysSpeed={0.5}
                lightSpread={0.9}
                rayLength={1.4}
                followMouse={true}
                mouseInfluence={0.2}
                noiseAmount={0.0}
                distortion={0.01}
              />
          </div>
          <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
