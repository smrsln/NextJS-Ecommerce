import { NextRequest, NextResponse } from "next/server";
import cookie from "cookie";

function logRequest(req: NextRequest) {
  // Commented out because of high cost. Uncomment for debugging purposes
  // const serviceName = req.nextUrl.pathname.split("/")[2] || "unknown-service";
  // console.info(`API Request to ${req.nextUrl.pathname}`, {
  //   method: req.method,
  //   path: req.nextUrl.pathname,
  //   userAgent: req.headers.get("user-agent"),
  //   service: serviceName,
  // });
}

export async function middleware(req: NextRequest) {
  // Uncomment for debugging purposes
  // if (req.nextUrl.pathname.startsWith("/api")) {
  //   logRequest(req);
  // }

  const validPaths = ["/signin", "/signup"];
  if (validPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
    const cookies = cookie.parse(req.headers.get("Cookie") || "");
    const cookieName = process.env.VERCEL
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";
    const sessionToken = cookies["next-auth.session-token"];

    if (sessionToken) {
      const redirectUrl = new URL("/", req.nextUrl);
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  // Proceed with the request
  return NextResponse.next();
}
