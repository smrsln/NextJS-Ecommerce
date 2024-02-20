import { FC, ReactNode } from "react";
import { ThemeProvider } from "@/app/components/themeProvider";
import "@/app/globals.css";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import Navbar from "@/app/components/Navbar";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Navbar className="top-2" />
        <ErrorBoundary>{children}</ErrorBoundary>
        <footer>Footer</footer>
      </ThemeProvider>
    </>
  );
};

export default RootLayout;
