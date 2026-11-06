import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  if (request.auth) return;

  const url = new URL("/", request.nextUrl);
  url.searchParams.set("auth", "login");
  url.searchParams.set(
    "callbackUrl",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  return NextResponse.redirect(url);
});

export const config = { matcher: ["/dashboard/:path*"] };
