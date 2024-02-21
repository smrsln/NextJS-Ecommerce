import { FC, ReactNode } from "react";
import { ThemeProvider } from "@/app/components/themeProvider";
import "@/app/globals.css";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import Navbar from "@/app/components/Navbar";
import Head from "next/head";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Ecommerce</title>
        </Head>
        <Navbar />
      </header>
      <div className="container mx-auto px-4">
        <ErrorBoundary>{children}</ErrorBoundary>
        <footer>Footer</footer>
      </div>
    </ThemeProvider>
  );
};

export default RootLayout;
