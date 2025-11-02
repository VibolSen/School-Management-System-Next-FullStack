
import AdminSidebar from '@/components/sidebar/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
