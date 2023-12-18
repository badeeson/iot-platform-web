import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import LogInPage from '@/components/LogIn';

export default function Page() {
  const userLogin = async (formData: FormData) => {
    'use server';

    try {
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
      console.log('json', json)
      if (json) {
        const token = json?.token;
        cookieStore.set('token', token, {
          maxAge: 3600 * 24,
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV !== "development"
        });
        // redirect(`/post`);
      }
      
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <LogInPage userLogin={userLogin} />
  );
}