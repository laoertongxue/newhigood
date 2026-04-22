import { redirect } from 'next/navigation';

/**
 * Root page - redirects to auth login
 */
export default function Home() {
  redirect('/auth/login');
}
