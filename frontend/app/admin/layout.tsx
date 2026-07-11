import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background gradient-bg flex">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0 overflow-auto">
        <div className="p-6 pt-20 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
