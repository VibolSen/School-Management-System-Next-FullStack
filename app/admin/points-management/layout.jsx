
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <main className="flex-grow p-8">{children}</main>
    </div>
  );
}
