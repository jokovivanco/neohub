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
    "NeoHub brings the future of ecommerce with seamless shopping, secure checkout, and powerful analytics – built on modern web technologies.",
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
              <Toaster />
            </div>
          </ThemeProvider>
          {env.NODE_ENV === "development" ? <ReactQueryDevtools /> : null}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
