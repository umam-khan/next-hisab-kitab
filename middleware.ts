import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
// import type { Database } from '@/lib/database.types'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  //get session
  const { data : {session}} = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;

  //define the apths
  const restrictedPaths = ["/","/dashboard"];
  const authPaths = ["/login"];

  // redirect authenticated users from auth pages to home page
  if(authPaths.includes(path) && session)
    {
      console.log("redirecting", session);
      return NextResponse.redirect(new URL("/",req.url));

    }
  // redirect unauthenticated users from restricted pages to auth page
  if(restrictedPaths.includes(path) && !session)
    {
      console.log("redirecting", session);
      return NextResponse.redirect(new URL("/login",req.url));
      

    }
  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
// import {
//   clerkMiddleware,
//   createRouteMatcher
// } from '@clerk/nextjs/server';

// const isProtectedRoute = createRouteMatcher([
//   '/dashboard(.*)',
//   '/forum(.*)',
// ]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth().protect();
// });

// export const config = {
//   matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
// };