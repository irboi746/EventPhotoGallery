import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkAuthentication } from '@/app/utils/auth';

// Whitelist of paths that should not require authentication
const whitelist = [
  "/api/auth",
  "/not-found",     
];

export async function middleware(request: NextRequest) {
  // get path value
  const currentPath = request.nextUrl.pathname;
  
  // Allow the request to whitelisted to continue without authentication
  if (whitelist.some(path => currentPath.startsWith(path))) {
    return NextResponse.next();  
  }

  // Get cookie value
  const cookieStore = await cookies();
  const authCookie = cookieStore.get('x-custom-auth');

  // decrypt jwt cookie value using the decryption module
  
  if (authCookie){
    try{
    const isAuthenticated = await checkAuthentication(authCookie);

    // Allow the request to continue if the user is authenticated
    if (isAuthenticated){
      return NextResponse.next();
    } 
    } catch(err){
      return NextResponse.redirect(new URL('/not-found', request.nextUrl));
    }
  }
  return NextResponse.redirect(new URL('/not-found', request.nextUrl));
}

// Specify which paths to apply the middleware to
export const config = {
  matcher: ['/:path*'],  // Protect the /photoalbum page or any sub-paths
};
