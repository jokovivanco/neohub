import type { Metadata } from "next";

import env from "@/env";
import "@/styles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import ReactQueryProvider from "@/components/providers/ReactQuery";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NeoHub – Shop Smarter, Faster, and Modern",
  description:
    "NeoHub is a modern fullstack ecommerce platform built with Next.js, Better Auth, Tailwind, shadcn, Drizzle ORM, and PostgreSQL (Neon).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="scroll-smooth antialiased">
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div>
              {children}
              {/* <div className="grid h-screen grid-rows-[auto_1fr_auto]">
                <div className="prose-base container mx-auto py-3">
                </div>
              </div> */}
              <Toaster />
            </div>
          </ThemeProvider>
          {env.NODE_ENV === "development" ? <ReactQueryDevtools /> : null}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
