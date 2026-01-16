import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

export const metadata: Metadata = {
  title: "VarejoIA",
  description: "Plataforma de agentes inteligentes para análise de dados",
};

// Script to set theme and language before React hydrates - prevents flash
const initScript = `
  (function() {
    try {
      // Theme
      var theme = localStorage.getItem('varejo180_theme');
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }

      // Language
      var lang = localStorage.getItem('varejo180_language');
      if (lang === 'en') {
        document.documentElement.setAttribute('data-lang', 'en');
        document.documentElement.lang = 'en';
      } else {
        document.documentElement.setAttribute('data-lang', 'pt-br');
        document.documentElement.lang = 'pt-BR';
      }
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.setAttribute('data-lang', 'pt-br');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" data-theme="dark" data-lang="pt-br" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </head>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
