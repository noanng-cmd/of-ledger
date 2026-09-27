import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OF Ledger | zGaming Emerald",
  description:
    "Dar transparência ao mercado do zGaming Emerald para que os jogadores saibam quanto os itens realmente valem."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
