import type { Metadata } from "next";
import "./globals.css";
import { ReservationProvider } from "@/contexts/ReservationContext";
import { CartProvider } from "@/contexts/CartContext";

export const metadata: Metadata = {
  title: "Prague For You - Guest Services",
  description: "Purchase extra services during your stay",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">
        <ReservationProvider>
          <CartProvider>{children}</CartProvider>
        </ReservationProvider>
      </body>
    </html>
  );
}
