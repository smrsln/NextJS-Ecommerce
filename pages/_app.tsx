import { QueryClient,QueryClientProvider } from "react-query";}
import type { AppProps } from "next/app";
import RootLayout from "@/app/components/layout";
import CustomErrorPage from "@/pages/_error";

const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </QueryClientProvider>
  );
}

export default MyApp;
