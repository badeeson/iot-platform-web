import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const PUBLIC_FILE = /\.(.*)$/;
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get('token')?.value
  // console.log('token', token)
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    PUBLIC_FILE.test(pathname)  // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }
  
  if (token) {
    const res = await fetch('http://localhost:4000/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    })
    const data = await res.json();
    if (data?.isValid) {
      if (pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
      return NextResponse.next()
    }
  }

  return NextResponse.rewrite(new URL('/auth/login', request.url));
}

// export const config = {
//   matcher: '/',
// }