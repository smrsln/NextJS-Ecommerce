import { FC, ReactNode } from "react";
import "@/app/globals.css";
import ErrorBoundary from "@/app/components/ErrorBoundary";

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <>
      <header>Header</header>
      <ErrorBoundary>{children}</ErrorBoundary>
      <footer>Footer</footer>
    </>
  );
};

export default RootLayout;
