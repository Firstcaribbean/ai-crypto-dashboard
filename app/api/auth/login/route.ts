import { NextResponse } from "next/server";
import { createSessionToken, getAdminCredentials, SESSION_COOKIE } from "../../../lib/auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  const credentials = getAdminCredentials();

  if (username !== credentials.username || password !== credentials.password) {
    return NextResponse.redirect(new URL("/login?error=1", request.url), { status: 303 });
  }

  const response = NextResponse.redirect(new URL("/admin", request.url), { status: 303 });
  response.cookies.set(SESSION_COOKIE, await createSessionToken(username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/"
  });

  return response;
}
