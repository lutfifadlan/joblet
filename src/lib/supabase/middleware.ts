import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: DO NOT REMOVE auth.getUser()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if the path is for job edit or post pages which require authentication
  const isProtectedJobPath =
    request.nextUrl.pathname.startsWith("/jobs/edit/") ||
    request.nextUrl.pathname.startsWith("/jobs/post");

  // Public paths: home, auth pages, job listings
  // Protected paths: everything else including job edit/post pages
  // Allow both GET and POST requests to /auth/signin
  const isAuthSignin = request.nextUrl.pathname.startsWith("/auth/signin");
  const isAuthCallback = request.nextUrl.pathname.startsWith("/api/auth/callback");
  const isAuthGoogle = request.nextUrl.pathname.startsWith("/api/auth/google");
  
  if (
    !user &&
    request.nextUrl.pathname !== "/" &&
    !isAuthSignin &&
    !isAuthCallback &&
    !isAuthGoogle &&
    (!request.nextUrl.pathname.startsWith("/jobs") || isProtectedJobPath)
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
