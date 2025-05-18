import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from "@cloudflare/next-on-pages";
import { notFound } from 'next/navigation';
import { encryptJWT } from '@/app/utils/jwtEncryption'

export const runtime = "edge";

const GALLERY_URL = '/gallery/the-newly-weds';
const CUSTOM_COOKIE = 'x-custom-auth';
const SECRET = process.env.SECRET;
const ENCKEY = process.env.ENCKEY;

export async function GET(request: NextRequest) {
  // Extract uniqueId from the URL path
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/');
  const uniqueId = pathParts[pathParts.length - 1];
  const headers = new Headers();

  const kvNamespace = getRequestContext().env.namespace;

  if (!kvNamespace) {
    console.error("KV Namespace not bound correctly.");
    return new NextResponse('Internal Server Error', { status: 500 });
  }
 
  if (uniqueId){
    // Get the valid unique ID from KV only if kvNamespace is defined || act as checking key
    const kvKeyValue = await kvNamespace.get(uniqueId); 
    if (kvKeyValue) {
      // Create destination URL
      const destinationUrl = new URL(GALLERY_URL, request.url);
    
      // Create response with 302 redirect instead of default 307
      const response = NextResponse.redirect(destinationUrl, { status: 302 });
    
      // generate encrypted jwt
      if (SECRET && ENCKEY){
        const encryptedJWT = await encryptJWT(JSON.parse(kvKeyValue), SECRET, ENCKEY);
        
        // Set a cookie instead of header
        
        response.cookies.set(CUSTOM_COOKIE, encryptedJWT, {
          path: '/',      // Cookie available on all paths
          httpOnly: true, // Cannot be accessed via JavaScript
          secure: true,   // Only sent over HTTPS
          maxAge: 60 * 120  // client-side cookie age (2 hours)
        });
        
        /*
        // alternative method to add cookies
        const headers = response.headers;
        const cookieValue = `${CUSTOM_COOKIE}=${encryptedJWT}; Path=/; HttpOnly; Secure; Max-Age=${60 * 120}`;
        headers.append('Set-Cookie', cookieValue);
        */
      }
      return response;
    }   
  }
  // If invalid, return a 404 response
  return notFound()
}
