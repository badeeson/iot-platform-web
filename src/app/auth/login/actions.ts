'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function userLogin(formData: FormData) {
  const cookieStore = cookies();
  const rawBody = {
    username: formData.get('username'),
    password: formData.get('password'),
  };
  const res = await fetch('http://localhost:4000/auth/login', {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(rawBody)
  });
  const json = await res.json();
  
  if (json) {
    console.log('json', json)
    const token = json?.token;
    cookieStore.set('token', token, {
      maxAge: 3600 * 24,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV !== "development"
    });
    redirect(`/`);
  }

};