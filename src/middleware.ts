import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  // console.log('token', token)
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
      if (request.nextUrl.pathname.startsWith('/auth/login')) {
        return NextResponse.redirect(new URL('/devices', request.url))
      }
      return NextResponse.next()
    }
  }

  return NextResponse.rewrite(new URL('/auth/login', request.url));
}

// export const config = {
//   matcher: '/',
// }