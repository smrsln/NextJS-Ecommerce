import { AppProps } from "next/app";
import RootLayout from "@/app/components/layout";
import CustomErrorPage from "@/pages/_error";

function MyApp({
  Component,
  pageProps,
  err,
}: AppProps & { err: Error & { statusCode?: number } }) {
  if (err) {
    // If there's an error, render the custom error page
    return (
      <CustomErrorPage
        statusCode={err.statusCode || 500}
        err={err}
        isReadyToRender={true}
      />
    );
  }

  // Otherwise, render the page component inside the RootLayout
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
