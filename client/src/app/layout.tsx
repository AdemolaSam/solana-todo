"use client";
import "./globals.css";

import { ReactNode } from "react";
import { WalletContextProvider } from "@/providers/WalletProvider";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider>
          <AuthProvider>{children}</AuthProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
