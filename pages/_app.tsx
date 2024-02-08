import RootLayout from "@/app/layout";

function MyApp({
  Component,
  pageProps,
  err,
}: {
  Component: React.ComponentType<any>;
  pageProps: any;
  err: Error;
}) {
  return (
    <RootLayout>
      <Component {...pageProps} err={err} />
    </RootLayout>
  );
}

export default MyApp;
