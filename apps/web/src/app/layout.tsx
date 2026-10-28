import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ramp",
  description:
    "Ramp finds website accessibility issues and proposes reviewable source-code repairs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
