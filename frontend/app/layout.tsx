import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentAPI - Sistema de Agentes Inteligentes",
  description: "Plataforma de agentes inteligentes para análise de dados",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
