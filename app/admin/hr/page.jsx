import { redirect } from 'next/navigation';

export default function HRRedirectPage() {
  redirect('/admin/hr/dashboard');
}
