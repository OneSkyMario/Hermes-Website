import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/context/AuthContext";
import { ShopProvider } from "./context/ShopContext";
import { OrderProvider } from "./context/OrderContext";
import { DeliveryProvider } from "./context/DeliveryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Otto — Autonomous Delivery",
  description: "Explore coffee, local stores, and autonomous robot delivery with Otto.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a className="skip-link" href="#main-content">Skip to content</a>
        <AuthProvider>
          <ShopProvider>
            <OrderProvider>
              <DeliveryProvider>
                {children}
              </DeliveryProvider>
            </OrderProvider>
          </ShopProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
