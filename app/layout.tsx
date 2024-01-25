import { Inter } from "next/font/google";
import "./globals.css";

// If you're not using the 'inter' variable, you can comment it out or remove it
// const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
