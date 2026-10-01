import { AdminAuthProvider } from "@/hooks/useAdminAuth";
import { AdminGuard } from "@/components/admin/AdminGuard";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AdminAuthProvider>
  );
}
